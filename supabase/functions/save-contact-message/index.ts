import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method === "GET") {
      const filePath = "/tmp/messages.json";
      try {
        const content = await Deno.readTextFile(filePath);
        const messages = JSON.parse(content);
        return new Response(
          JSON.stringify({
            success: true,
            data: messages,
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      } catch {
        return new Response(
          JSON.stringify({
            success: true,
            data: [],
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    if (req.method === "POST") {
      const { name, email, message }: { name: string; email: string; message: string } = await req.json();

      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const newMessage: ContactMessage = {
        id: Date.now().toString(),
        name,
        email,
        message,
        created_at: new Date().toISOString(),
        read: false,
      };

      const filePath = "/tmp/messages.json";
      let messages: ContactMessage[] = [];

      try {
        const content = await Deno.readTextFile(filePath);
        messages = JSON.parse(content);
      } catch {
        messages = [];
      }

      messages.push(newMessage);
      await Deno.writeTextFile(filePath, JSON.stringify(messages, null, 2));

      return new Response(
        JSON.stringify({
          success: true,
          message: "Message saved successfully",
          data: newMessage,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (req.method === "PUT") {
      const { id, read }: { id: string; read: boolean } = await req.json();

      const filePath = "/tmp/messages.json";
      let messages: ContactMessage[] = [];

      try {
        const content = await Deno.readTextFile(filePath);
        messages = JSON.parse(content);
      } catch {
        return new Response(
          JSON.stringify({ error: "No messages found" }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const messageIndex = messages.findIndex((m) => m.id === id);
      if (messageIndex === -1) {
        return new Response(
          JSON.stringify({ error: "Message not found" }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      messages[messageIndex].read = read;
      await Deno.writeTextFile(filePath, JSON.stringify(messages, null, 2));

      return new Response(
        JSON.stringify({
          success: true,
          message: "Message updated successfully",
          data: messages[messageIndex],
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (req.method === "DELETE") {
      const { id }: { id: string } = await req.json();

      const filePath = "/tmp/messages.json";
      let messages: ContactMessage[] = [];

      try {
        const content = await Deno.readTextFile(filePath);
        messages = JSON.parse(content);
      } catch {
        return new Response(
          JSON.stringify({ error: "No messages found" }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const filteredMessages = messages.filter((m) => m.id !== id);
      if (filteredMessages.length === messages.length) {
        return new Response(
          JSON.stringify({ error: "Message not found" }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      await Deno.writeTextFile(filePath, JSON.stringify(filteredMessages, null, 2));

      return new Response(
        JSON.stringify({
          success: true,
          message: "Message deleted successfully",
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error.message);

    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
