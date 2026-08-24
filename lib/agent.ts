import { ToolLoopAgent } from "ai";

export const shoppingAgent = new ToolLoopAgent({ model: "anthropic/claude-sonnet-4.6", instructions: "You are a helpful assistant that can help with shopping." });