
import { GoogleGenAI, Type } from "@google/genai";
import type { Meeting, SalesRecord, GeneratedFollowUp, Participant } from '../types';

// This check is important, but we'll also add checks inside the functions for better UI feedback.
if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a meeting agenda using past meetings and sales data.
 * @param pastMeetings - Array of past meeting objects.
 * @param salesRecords - Array of sales record objects.
 * @returns A string containing the generated agenda.
 */
export async function generateAgenda(pastMeetings: Meeting[], salesRecords: SalesRecord[]): Promise<string> {
    if (!process.env.API_KEY) {
        return "Error: API_KEY is not configured.\nPlease set the API_KEY environment variable to use AI features.";
    }

    const latestMeeting = pastMeetings[0];
    const recentSales = salesRecords.slice(0, 3);

    const prompt = `
        You are an AI meeting assistant for a vendor-distributor relationship.
        Your task is to generate a concise, actionable agenda for the upcoming meeting.

        Context from the last meeting on ${latestMeeting.date}:
        Topic: ${latestMeeting.topic}
        Outcome: ${latestMeeting.outcome}

        Recent sales data context:
        ${recentSales.map(r => `- ${r.product}: ${r.licenses} licenses sold to ${r.customerType} clients in ${r.month}.`).join('\n')}

        Based on this context, create a 3-point agenda for the next meeting. 
        For each point, add a brief description of the goal.
        Format the output as a clean, readable text. Do not use Markdown formatting like # or **.
        
        Example format:
        1. Review of Previous Action Items: Briefly touch on the outcomes from our last discussion on [Previous Topic].
        2. Q3 Sales Performance Analysis: Discuss the recent sales figures, focusing on [Key Product] and opportunities for growth.
        3. 'QuantumLeap' Product Launch Strategy: Finalize the marketing and distribution plan for the new product launch in the DACH region.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating agenda:", error);
        // Provide a more user-friendly error that can be displayed in the UI
        return `Error: Could not generate agenda.\nThis might be due to an invalid API key or network issues. Please check your configuration and try again.`;
    }
}

/**
 * Generates follow-up tasks based on a meeting summary.
 * @param meetingSummary - A string summarizing the meeting's key decisions.
 * @returns An array of generated follow-up objects.
 */
export async function generateFollowUps(meetingSummary: string): Promise<GeneratedFollowUp[]> {
     if (!process.env.API_KEY) {
        console.error("API_KEY is not configured.");
        // Return an empty array or a mock error response
        return [];
    }
    const prompt = `
        Based on the following meeting summary, identify and create a list of 2-3 clear, actionable follow-up tasks.
        Assign a priority ('High', 'Medium', 'Low') and a suggested due date for each task (relative to today, which is ${new Date().toLocaleDateString('en-CA')}).

        Meeting Summary: "${meetingSummary}"

        Return the tasks as a JSON array.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            task: { type: Type.STRING },
                            priority: { type: Type.STRING },
                            date: { type: Type.STRING },
                        },
                        required: ["task", "priority", "date"],
                    },
                },
            },
        });

        // The response text needs to be parsed as JSON.
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as GeneratedFollowUp[];

    } catch (error) {
        console.error("Error generating follow-ups:", error);
        // In case of an error, return an empty array to prevent the app from crashing.
        return [];
    }
}


/**
 * Generates a transcript and summary from meeting notes and agenda.
 * @param agenda - The meeting agenda.
 * @param notes - The notes taken during the meeting.
 * @returns An object with the transcript and summary.
 */
export async function generateTranscriptAndSummary(agenda: string, notes: string): Promise<{ transcript: string; summary: string }> {
    // For the prototype, we'll create a mock transcript.
    const mockTranscript = `
[00:01] You: Welcome, everyone. Let's start with the first item on our agenda.
[02:30] German Distributor: We've seen great progress on the Q3 sales front, especially with the 'Fusion' software.
[05:15] You: That's excellent news. The notes here mention a focus on enterprise clients. How is that panning out?
[07:45] German Distributor: It's going well. We need those new marketing materials to really push it forward.
[10:20] You: Agreed. Let's transition to the 'QuantumLeap' product launch. Any blockers?
[12:50] German Distributor: The main feedback from our team is on the UI. They feel it could be more intuitive for the German market.
[15:10] You: Understood. Let's make that a high-priority follow-up. I've noted it down.
[17:00] You: Okay, I think that covers everything. We have our action items. Thanks for a productive meeting.
    `.trim();

    if (!process.env.API_KEY) {
        return {
            transcript: mockTranscript,
            summary: "Error: API_KEY is not configured. Cannot generate AI summary.",
        };
    }

    const prompt = `
        You are an AI meeting assistant. Your task is to generate a concise, professional summary of a meeting.
        Use the provided meeting agenda and the raw notes taken during the call to create the summary.
        The summary should have three sections: Key Discussion Points, Decisions Made, and Action Items.

        Meeting Agenda:
        ---
        ${agenda}
        ---

        Raw Meeting Notes:
        ---
        ${notes}
        ---

        Generate the summary based on this context. Do not make up information.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return {
            transcript: mockTranscript,
            summary: response.text,
        };
    } catch (error) {
        console.error("Error generating summary:", error);
        return {
            transcript: mockTranscript,
            summary: `Error: Could not generate summary.\nThis might be due to an invalid API key or network issues.`,
        };
    }
}

/**
 * Analyzes meeting history with a participant to generate a relationship summary.
 * @param participant - The participant object.
 * @param meetings - An array of meetings with that participant.
 * @returns A string containing the AI-generated summary.
 */
export async function generateRelationshipSummary(participant: Participant, meetings: Meeting[]): Promise<string> {
    if (!process.env.API_KEY) {
        return "Error: API_KEY is not configured.\nPlease set the API_KEY environment variable to use AI features.";
    }

    const meetingHistory = meetings.map(m => `- On ${m.date}, discussed "${m.topic}" with the outcome: "${m.outcome}"`).join('\n');

    const prompt = `
        You are a relationship management AI. Based on the following meeting history with ${participant.name} (who you sometimes call "${participant.nickname}"), generate a brief summary of the relationship. 
        
        Your summary should touch on:
        1.  **Common Themes:** What topics come up frequently? (e.g., sales performance, product feedback, strategy).
        2.  **Interaction Pattern:** Is the relationship more strategic, operational, or technical? 
        3.  **Key Contributions:** What has ${participant.name} been most influential on?

        Meeting History:
        ---
        ${meetingHistory}
        ---

        Provide a concise, professional summary. Do not use Markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating relationship summary:", error);
        return `Error: Could not generate summary.\nThis might be due to an invalid API key or network issues.`;
    }
}
