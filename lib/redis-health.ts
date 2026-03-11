import { Socket } from "node:net";

const DEFAULT_REDIS_HOST = "127.0.0.1";
const DEFAULT_REDIS_PORT = 6379;

export async function pingRedis(timeoutMs = 1200) {
  const host = process.env.REDIS_HOST ?? DEFAULT_REDIS_HOST;
  const port = Number(process.env.REDIS_PORT ?? DEFAULT_REDIS_PORT);

  return new Promise<{ ok: boolean; message: string; host: string; port: number }>((resolve) => {
    const socket = new Socket();
    let settled = false;

    const finish = (ok: boolean, message: string) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve({ ok, message, host, port });
    };

    socket.setTimeout(timeoutMs);

    socket.on("connect", () => {
      socket.write("*1\r\n$4\r\nPING\r\n");
    });

    socket.on("data", (chunk: Buffer) => {
      const text = chunk.toString("utf8").trim();
      if (text.startsWith("+PONG")) {
        finish(true, "Redis responded with PONG");
        return;
      }

      finish(false, `Unexpected Redis response: ${text}`);
    });

    socket.on("timeout", () => {
      finish(false, `Redis timeout after ${timeoutMs}ms`);
    });

    socket.on("error", (error) => {
      finish(false, error.message);
    });

    socket.connect(port, host);
  });
}
