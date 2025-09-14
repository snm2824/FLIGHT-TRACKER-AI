import { GoogleGenAI } from "@google/genai";
import { FlightData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fetchFlightData = async (flightNumber: string): Promise<FlightData> => {
  const prompt = `
    Get the real-time flight status for the flight with flight number or call sign: ${flightNumber}. It is crucial that you find the correct flight whether the input is a standard flight number (like 'BA245') or an ICAO call sign (like 'BAW245').
    Provide the output as a single, minified JSON object. Do not use markdown backticks or any text outside of the JSON object.
    The JSON object must follow this exact structure:
    {
      "flightNumber": "string",
      "airline": "string",
      "status": "string (e.g., 'En Route', 'Landed', 'Scheduled', 'Delayed')",
      "progressPercent": "number (0-100, representing flight completion)",
      "departure": {
        "airportCode": "string (IATA code)",
        "airportName": "string",
        "city": "string",
        "country": "string",
        "scheduledTime": "string (ISO 8601 format)",
        "actualTime": "string (ISO 8601 format, can be same as scheduled if on time)",
        "terminal": "string",
        "gate": "string",
        "coordinates": { "latitude": number, "longitude": number },
        "timezone": "string (IANA time zone name, e.g., 'America/New_York')"
      },
      "arrival": {
        "airportCode": "string (IATA code)",
        "airportName": "string",
        "city": "string",
        "country": "string",
        "scheduledTime": "string (ISO 8601 format)",
        "actualTime": "string (ISO 8601 format, can be same as scheduled if on time or estimated)",
        "terminal": "string",
        "gate": "string",
        "coordinates": { "latitude": number, "longitude": number },
        "timezone": "string (IANA time zone name, e.g., 'Europe/London')"
      },
      "currentPosition": { "latitude": number, "longitude": number }
    }
    IMPORTANT RULES FOR 'progressPercent':
    - If the flight 'status' is 'Landed', 'progressPercent' MUST be 100.
    - If the flight 'status' is 'Scheduled' or 'Delayed', 'progressPercent' MUST be 0.
    - If the flight 'status' is 'En Route', calculate the percentage of the journey completed.

    If the flight is not en route (Scheduled/Delayed), the currentPosition should be the same as the departure coordinates. If the flight has landed, it should be the same as the arrival coordinates.
    Ensure all fields are populated. If a value is unknown, use "N/A".
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const textResponse = response.text.trim();
        
        const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
        
        if (!jsonMatch || (!jsonMatch[1] && !jsonMatch[2])) {
          throw new Error("Invalid JSON response format from AI.");
        }
        
        const jsonString = jsonMatch[1] || jsonMatch[2];

        const data: FlightData = JSON.parse(jsonString);

        if (!data.flightNumber || !data.departure || !data.arrival || data.progressPercent === undefined) {
            throw new Error("Received incomplete flight data from AI.");
        }
        
        // Sanitize AI output to ensure data consistency.
        if (data.status === 'Landed') {
            data.progressPercent = 100;
        } else if (data.status === 'Scheduled' || data.status === 'Delayed') {
            data.progressPercent = 0;
        }

        return data;

    } catch (error) {
        console.error("Error fetching flight data from Gemini:", error);
        if (error instanceof Error && error.message.includes("API key not valid")) {
             throw new Error("The API key is invalid. Please check your configuration.");
        }
        throw new Error(`Failed to fetch or parse flight data for ${flightNumber}. The flight number may be incorrect or the data is currently unavailable.`);
    }
};

export const generateFlightImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("AI did not return an image.");
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error("Error generating flight image from Gemini:", error);
        throw new Error("Failed to generate flight image.");
    }
};