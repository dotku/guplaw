"""Router agent that classifies queries and routes to specialists."""

import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field


class RouteDecision(BaseModel):
    """Routing decision for a legal query."""
    practice_area: str = Field(
        description="The practice area: family, debt, housing, estate, immigration, or crypto"
    )
    confidence: float = Field(
        description="Confidence score from 0.0 to 1.0"
    )
    reasoning: str = Field(
        description="Brief explanation of why this practice area was chosen"
    )
    urgency: str = Field(
        description="Urgency level: low, medium, high, or emergency"
    )


ROUTER_PROMPT = """You are a legal intake specialist for GPULaw. Your job is to analyze incoming legal queries and route them to the appropriate specialist.

PRACTICE AREAS:
1. family - Family Law: divorce, custody, child support, alimony, adoption, domestic violence, paternity
2. debt - Consumer & Debt: credit cards, bankruptcy, collections, FDCPA, student loans, wage garnishment
3. housing - Housing & Landlord-Tenant: evictions, leases, security deposits, repairs, rent disputes, fair housing
4. estate - Wills, Estates & Probate: wills, trusts, power of attorney, probate, estate planning, inheritance
5. immigration - Immigration: visas, green cards, citizenship, asylum, deportation, DACA, work permits
6. crypto - Cryptocurrency & Compliance: tokens, SEC/CFTC, AML/KYC, exchange compliance, NFTs, DeFi

URGENCY LEVELS:
- emergency: Immediate risk of harm, deportation, eviction within days, restraining orders needed
- high: Time-sensitive matters, court deadlines approaching, active legal proceedings
- medium: Important but not immediately time-sensitive
- low: General questions, planning, informational

Analyze the query and determine the best practice area and urgency level.

Query: {query}

Additional context (if any): {context}
"""


class RouterAgent:
    """Routes legal queries to the appropriate specialist agent."""

    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            temperature=0,
            api_key=os.environ.get("OPENAI_API_KEY")
        ).with_structured_output(RouteDecision)

        self.prompt = ChatPromptTemplate.from_template(ROUTER_PROMPT)

    async def route(self, query: str, context: str = "") -> RouteDecision:
        """Determine which specialist should handle this query."""
        chain = self.prompt | self.llm
        result = await chain.ainvoke({
            "query": query,
            "context": context or "None provided"
        })
        return result

    def get_endpoint(self, practice_area: str) -> str:
        """Get the API endpoint for a practice area."""
        endpoints = {
            "family": "/api/family",
            "debt": "/api/debt",
            "housing": "/api/housing",
            "estate": "/api/estate",
            "immigration": "/api/immigration",
            "crypto": "/api/crypto"
        }
        return endpoints.get(practice_area, "/api/family")
