import { genkit, z, indexerRef, run } from "genkit";
import { Document } from "genkit";
import { googleAI, gemini15Flash, textEmbeddingGecko001 } from "@genkit-ai/googleai";
import pdf from "pdf-parse";
import { devLocalIndexerRef, devLocalVectorstore, devLocalRetrieverRef } from '@genkit-ai/dev-local-vectorstore';
import { chunk } from 'llm-chunk';
import fs from "fs";

import dotenv from 'dotenv'
dotenv.config()

const ai = genkit({
    plugins: [
        googleAI({
            apiKey: process.env.GOOGLE_GEMINI_API_KEY
        }),
        devLocalVectorstore([
            {
                embedder: textEmbeddingGecko001,
                indexName: "facts"
            }
        ])
    ],
    model: gemini15Flash
});

export const PdfIndexer = devLocalIndexerRef("facts")

const chunkingConfig = {
    minLength: 1000,
    maxLength: 2000,
    splitter: "sentence",
    overlap: 100,
    delimiters: "",
} as any;


const indexMenu = ai.defineFlow(
    {
        name: "indexMenu",
        inputSchema: z.string(),
    },
    async () => {
        const pdfTXT = await pdf(fs.readFileSync(("Avengers.pdf")));

        const chunks = await run("chunk-it", async () =>
            chunk(pdfTXT.text, chunkingConfig)
        );

        await ai.index({
            indexer: PdfIndexer,
            documents: chunks.map((c: string) => Document.fromText(c))
        })
        
    }
);


export const retreiver = devLocalRetrieverRef("facts");


const mainFlow = ai.defineFlow(
    {
        name: "mainFlow",
        inputSchema: z.string(),
        outputSchema: z.string()
    },
    async (ques) => {
        const docs = await ai.retrieve({
            retriever: retreiver,
            query: ques,
            options: {
                k: 3
            }
        });

        const { text } = await ai.generate({
            prompt: ques,
            docs
        });
        return text;
    }
);


(async ()=> {
    console.log(await mainFlow())
})




// const helloFlow = ai.defineFlow(
//     'hello',
//     async () => {
//         const { text } = await ai.generate("say hello");
//         return text;
//     }
// );

// const helloInputFlow = ai.defineFlow(
//     { name: "helloInputFlow", inputSchema: z.string(), outputSchema: z.string() },
//     async (prompt) => {
//         const { text } = await ai.generate(`${prompt}`);
//         return text;
//     }
// );

// (async () => {
//     console.log(await helloFlow());
// })();

