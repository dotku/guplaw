"""Consumer & Debt Law Specialist Agent - Vercel Serverless Function."""

import json
import asyncio
from http.server import BaseHTTPRequestHandler

from agents.base import BaseSpecialistAgent, CaseInput
from agents.prompts import DEBT_CONSUMER_PROMPT


class DebtConsumerAgent(BaseSpecialistAgent):
    """Specialist agent for consumer and debt law matters."""

    def __init__(self):
        super().__init__(
            practice_area="Consumer & Debt Law",
            system_prompt=DEBT_CONSUMER_PROMPT
        )


agent = DebtConsumerAgent()


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(content_length)) if content_length > 0 else {}

            case_input = CaseInput(
                query=body.get("query", ""),
                category="debt",
                urgency=body.get("urgency"),
                context=body.get("context"),
                chat_history=body.get("chat_history")
            )

            result = asyncio.run(agent.analyze(case_input))

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

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
