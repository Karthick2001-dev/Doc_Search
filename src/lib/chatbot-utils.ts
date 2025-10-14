
// Mock API functions - these would be replaced with actual API calls
export async function searchDocuments(query: string) {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    results: [
      {
        pdf_name: "financial_report_2024.pdf",
        chunk_index: 1,
        text: "The company's revenue increased by 15% in Q1 2024, with the largest growth coming from the SaaS division which saw a 22% increase in subscriptions."
      },
      {
        pdf_name: "financial_report_2024.pdf",
        chunk_index: 3,
        text: "Operating expenses were reduced by 8% due to strategic automation and efficiency improvements in the customer service department."
      },
      {
        pdf_name: "product_roadmap.pdf",
        chunk_index: 2,
        text: "The new AI-powered features are planned for release in Q3 2024, with early beta testing scheduled for select customers in July."
      }
    ]
  };
}

export async function generateResponse(
  query: string,
  results: any[],
  model: string,
  options: {
    useExternalKnowledge: boolean;
    useWebSearch: boolean;
    useDetailedExplanation: boolean;
  }
) {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const modelResponses: Record<string, string> = {
    "ChatGPT": "Based on the financial report for 2024, the company has shown strong performance with a 15% revenue increase in Q1, primarily driven by the SaaS division (22% growth in subscriptions). Additionally, they've managed to reduce operating expenses by 8% through automation and efficiency improvements.\n\nThe product roadmap indicates new AI features planned for Q3 2024, with beta testing starting in July for select customers.",
    
    "Google Gemini": "The financial data shows positive trends:\n- 15% overall revenue growth in Q1 2024\n- SaaS division leading with 22% subscription growth\n- 8% reduction in operating expenses through automation\n\nThe product timeline shows AI feature development with:\n- Q3 2024 target release date\n- July beta testing with select customers",
    
    "Claude": "I analyzed the provided document chunks and found the following information:\n\n1. Financial Performance (from financial_report_2024.pdf):\n   - 15% revenue increase in Q1 2024\n   - SaaS division performed exceptionally with 22% subscription growth\n   - 8% reduction in operating expenses achieved through automation and customer service efficiencies\n\n2. Product Development (from product_roadmap.pdf):\n   - New AI features scheduled for Q3 2024 release\n   - Beta testing with select customers begins in July 2024",
    
    "Auto": "# Financial & Product Analysis\n\nBased on the document chunks, here's a comprehensive overview:\n\n## Financial Performance (Q1 2024)\n- **Overall Revenue**: ↑ 15%\n- **SaaS Division**: ↑ 22% (subscription growth)\n- **Operating Expenses**: ↓ 8% (through automation & efficiency improvements)\n\n## Product Development\n- **AI Features**: Scheduled for Q3 2024 release\n- **Beta Testing**: July 2024 with select customers\n\nThis suggests the company is experiencing strong growth while successfully controlling costs and has significant product innovations planned for later this year."
  };
  
  // Add some variation based on the options
  let response = modelResponses[model] || modelResponses["Auto"];
  
  if (options.useDetailedExplanation) {
    response = "## Chain of Thought Analysis\n\nLet me think step by step:\n\n1. First, let me understand what information we have from the documents.\n2. The financial report shows revenue growth and cost reductions.\n3. The product roadmap shows upcoming AI feature releases.\n\nNow let me synthesize this information:\n\n" + response;
  }
  
  if (options.useWebSearch) {
    response += "\n\n*Additional web search information: Industry analysts predict the AI market will grow by 35% this year, placing the company's roadmap in line with broader market trends.*";
  }
  
  if (options.useExternalKnowledge) {
    response += "\n\n*Based on my knowledge of similar SaaS companies, a 22% subscription growth rate places this company in the top quartile of performers in this sector.*";
  }
  
  return {
    response,
    model: model === "Auto" ? "Auto (Claude selected)" : model
  };
}

export async function fetchPdfList() {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    pdf_names: [
      "financial_report_2024.pdf",
      "product_roadmap.pdf",
      "customer_survey_results.pdf",
      "competitive_analysis.pdf",
      "technical_specifications.pdf"
    ]
  };
}

export async function uploadFile(file: File) {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate success response
  return {
    success: true,
    filename: file.name
  };
}
