import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    console.log("Received message:", message);  // Log input

    // const llm = new ChatOpenAI({
    //   model: "sonar",
    //   temperature: 0.7,
    //   apiKey: process.env.PERPLEXITY_API_KEY,
    //   configuration: {
    //     baseURL: "https://api.perplexity.ai",
    //   },
    // });
    const llm = new ChatOpenAI({
      model: "sarvam-m",
      temperature: 0.7,
      apiKey: process.env.SARVAM_API_KEY,
      configuration: {
        baseURL: "https://api.sarvam.ai/v1",
      },
    });
    console.log("LLM initialized");  // Confirm setup

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant in an Expense Tracker application.\
        You need to anwser the questions about expense tracking, finance management best practices.\
        You provide instructions to the user about how to use the application: add or edit transaction and categories,\
        set budgets to each categories.\
        - Add Transaction: Main Menu > Transactions/DashBoard > Click 'Add Transaction' button \
        - View Transactions: Main Menu > Transactions \
        - View Categories: Main Menu > Categories (In this the user can add/edit/delete categories, set budgets, view category wise spendings)\
        based on the above instructions, guide the users to use the application.\
        Answer only whatever question you receive in concise, easy to understandable way. \
        Reply 'I am an expense tracker assistant, I am not familiar with that.' if you receive questions not relevant to the above instructions. \
        Strictly follow the above instructions and do not answer any general questions which is not relevant to the expense tracker application"
        ],
      ["human", "{input}"],
    ]);

    const chain = prompt.pipe(llm);
    const response = await chain.invoke({ input: message });
    // console.log("LLM response:", response.content);  // Log output

    return NextResponse.json({ response: response.content }, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error.message);  // Log any errors
    return  NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

