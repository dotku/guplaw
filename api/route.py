"""Router API Endpoint - Routes queries to appropriate specialist agents."""

import json
import asyncio
from http.server import BaseHTTPRequestHandler

from agents.router import RouterAgent
from agents.base import BaseSpecialistAgent, CaseInput
from agents.prompts import PRACTICE_AREA_PROMPTS


# Initialize router
router = RouterAgent()

# Cache for specialist agents
_agent_cache = {}


def get_specialist_agent(practice_area: str) -> BaseSpecialistAgent:
    """Get or create a specialist agent for the practice area."""
    if practice_area not in _agent_cache:
        prompt = PRACTICE_AREA_PROMPTS.get(practice_area)
        if not prompt:
            prompt = PRACTICE_AREA_PROMPTS.get("family")  # fallback

        _agent_cache[practice_area] = BaseSpecialistAgent(
            practice_area=practice_area.replace("_", " ").title(),
            system_prompt=prompt
        )
    return _agent_cache[practice_area]


async def process_query(body: dict) -> dict:
    """Route and process a legal query."""
    query = body.get("query", "")
    context = body.get("context", "")
    chat_history = body.get("chat_history")

    # First, route the query to the appropriate specialist
    route_decision = await router.route(query, context)

    # Get the specialist agent
    specialist = get_specialist_agent(route_decision.practice_area)

    # Create case input
    case_input = CaseInput(
        query=query,
        category=route_decision.practice_area,
        urgency=route_decision.urgency,
        context=context,
        chat_history=chat_history
    )

    # Get specialist response
    response = await specialist.analyze(case_input)

    # Combine routing info with response
    return {
        "routing": {
            "practice_area": route_decision.practice_area,
            "confidence": route_decision.confidence,
            "reasoning": route_decision.reasoning,
            "urgency": route_decision.urgency,
            "endpoint": router.get_endpoint(route_decision.practice_area)
        },
        **response
    }


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(content_length)) if content_length > 0 else {}

            if not body.get("query"):
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "query is required"}).encode())
                return

            result = asyncio.run(process_query(body))

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_GET(self):
        """Return available practice areas and endpoints."""
        info = {
            "service": "GPULaw Legal Router",
            "version": "1.0.0",
            "endpoints": {
                "/api/route": "Smart router - auto-routes to specialist (POST)",
                "/api/family": "Family Law specialist (POST)",
                "/api/debt": "Consumer & Debt Law specialist (POST)",
                "/api/housing": "Housing & Landlord-Tenant specialist (POST)",
                "/api/estate": "Wills, Estates & Probate specialist (POST)",
                "/api/immigration": "Immigration Law specialist (POST)",
                "/api/crypto": "Cryptocurrency & Compliance specialist (POST)"
            },
            "usage": {
                "method": "POST",
                "body": {
                    "query": "Your legal question (required)",
                    "context": "Additional context (optional)",
                    "urgency": "low|medium|high|emergency (optional)",
                    "chat_history": "Previous messages array (optional)"
                }
            }
        }
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(info, indent=2).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
