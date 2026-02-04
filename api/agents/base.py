"""Base agent class for all specialist agents."""

import os
from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from pydantic import BaseModel


class CaseInput(BaseModel):
    """Input model for case analysis."""
    query: str
    category: Optional[str] = None
    urgency: Optional[str] = None
    context: Optional[str] = None
    chat_history: Optional[list] = None


class AgentResponse(BaseModel):
    """Response model for agent output."""
    analysis: str
    key_issues: list[str]
    recommended_actions: list[str]
    documents_needed: list[str]
    urgency_level: str
    attorney_recommended: bool
    disclaimer: str


class BaseSpecialistAgent:
    """Base class for all specialist legal agents."""

    def __init__(
        self,
        practice_area: str,
        system_prompt: str,
        model: str = "gpt-4-turbo-preview",
        temperature: float = 0.3
    ):
        self.practice_area = practice_area
        self.system_prompt = system_prompt
        self.llm = ChatOpenAI(
            model=model,
            temperature=temperature,
            api_key=os.environ.get("OPENAI_API_KEY")
        )
        self.prompt = self._build_prompt()

    def _build_prompt(self) -> ChatPromptTemplate:
        """Build the chat prompt template."""
        return ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            MessagesPlaceholder(variable_name="chat_history", optional=True),
            ("human", "{query}")
        ])

    def _format_chat_history(self, history: Optional[list]) -> list:
        """Convert chat history to LangChain message format."""
        if not history:
            return []

        messages = []
        for msg in history:
            if msg.get("role") == "user":
                messages.append(HumanMessage(content=msg.get("content", "")))
            elif msg.get("role") == "assistant":
                messages.append(AIMessage(content=msg.get("content", "")))
        return messages

    async def analyze(self, case_input: CaseInput) -> dict:
        """Analyze a legal case and provide guidance."""
        chain = self.prompt | self.llm

        chat_history = self._format_chat_history(case_input.chat_history)

        # Build the query with context
        query = case_input.query
        if case_input.context:
            query = f"Additional context: {case_input.context}\n\nQuestion: {query}"
        if case_input.urgency:
            query = f"[Urgency: {case_input.urgency}]\n\n{query}"

        response = await chain.ainvoke({
            "query": query,
            "chat_history": chat_history
        })

        return {
            "practice_area": self.practice_area,
            "response": response.content,
            "disclaimer": self._get_disclaimer()
        }

    def _get_disclaimer(self) -> str:
        """Return the legal disclaimer."""
        return (
            "DISCLAIMER: This information is provided for general educational purposes only "
            "and does not constitute legal advice. GPULaw is not a law firm. For specific "
            "legal advice regarding your situation, please consult with a licensed attorney. "
            "Use of this service does not create an attorney-client relationship."
        )
