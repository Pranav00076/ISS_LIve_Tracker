import { Position } from "./geo";
import { TavilyArticle } from "../services/tavilyService";

export function buildDashboardContext(
  currentPosition: Position | null,
  history: Position[],
  speed: number,
  astronauts: { name: string; craft: string }[],
  articles: TavilyArticle[],
): string {
  const lat = currentPosition ? currentPosition.lat.toFixed(4) : "Unknown";
  const lng = currentPosition ? currentPosition.lng.toFixed(4) : "Unknown";

  return `ISS DATA:
Latitude: ${lat}
Longitude: ${lng}
Speed: ${speed.toFixed(2)} km/h
Tracked Positions: ${history.length}

ASTRONAUTS (${astronauts.length} in space):
${astronauts.map((a) => `- ${a.name} (${a.craft})`).join("\\n")}

NEWS ARTICLES:
${articles
  .slice(0, 5)
  .map(
    (article, i) =>
      `[${i + 1}] Title: ${article.title}\\nSummary: ${article.content}`,
  )
  .join("\\n\\n")}
`;
}

export function buildAIPrompt(
  dashboardContext: string,
  userQuestion: string,
): string {
  return `You are a helpful and intelligent dashboard assistant for a Space Dashboard application.

You have access to the dashboard data below. Answer user questions based on this data when relevant.
You can also answer general space-related questions or engage in a friendly conversation.

DASHBOARD DATA:
${dashboardContext}

USER QUESTION:
${userQuestion}
`;
}
