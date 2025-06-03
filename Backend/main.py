import os
from dotenv import load_dotenv
from fastapi import FastAPI, Form, UploadFile, File
from fastapi.responses import JSONResponse
from docx import Document as DocxDocument
from PyPDF2 import PdfReader
from typing import Optional
import uvicorn
from google import genai
from fastapi.middleware.cors import CORSMiddleware
from google.genai import types



# Load environment variables from .env
load_dotenv()

# Fetch the key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the environment variables")

# Configuration variables
ALLOWED_EXTENSIONS = {'.pdf', '.txt', '.docx'}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080","http://localhost:8081"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_content):
    """Extract text from PDF file content"""
    try:
        from io import BytesIO
        reader = PdfReader(BytesIO(file_content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise ValueError(f"Error reading PDF: {str(e)}")

def extract_text_from_docx(file_content):
    """Extract text from DOCX file content"""
    try:
        from io import BytesIO
        doc = DocxDocument(BytesIO(file_content))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        raise ValueError(f"Error reading DOCX: {str(e)}")

def extract_text_from_txt(file_content):
    """Extract text from TXT file content"""
    try:
        return file_content.decode('utf-8')
    except Exception as e:
        raise ValueError(f"Error reading TXT: {str(e)}")

def extract_document_text(file_content, filename):
    """Extract text based on file extension"""
    file_extension = os.path.splitext(filename)[1].lower()
    
    if file_extension == '.pdf':
        return extract_text_from_pdf(file_content)
    elif file_extension == '.txt':
        return extract_text_from_txt(file_content)
    elif file_extension == '.docx':
        return extract_text_from_docx(file_content)
    else:
        raise ValueError(f"Unsupported file type: {file_extension}")
    
    

    
def CreatePrompt(system_prompt: str, istructions: str, example_output: str,model: str, api_key: str,document_text:str,max_tokens,ai_temperature):
    print(system_prompt,'system_prompt',istructions,'istructions',example_output,'example_output',model,'model',api_key)
    try:
        client = genai.Client(api_key=api_key)
        prompt=f"""You are an advanced prompt generator designed to construct precise and standardized task prompts for AI models. Using the following inputs:
    System Prompt: 
    {system_prompt}

    Transcription: {{voice_dictation}}

    Carefully analyze the provided medical transcription. Extract all relevant information and organize it according to the following categories and structure:
    {document_text}
    
    Using the following structure and clinical standards, generate the response as per example output:
    {example_output}

    Strictly follow these Instructions: 
    {istructions}

    Using the inputs provided, construct the final task prompt as follows:
    - Clearly define the role and expertise of the model based on the System Prompt.
    - Include the Example Output to demonstrate the expected format, structure, and level of detail.
    - Emphasize the Strict Instructions to ensure strict adherence to formatting, clinical accuracy, and domain-specific standards.
    - Ensure clarity, completeness, and consistency suitable for use in high-stakes medical or clinical environments.

    IMPORTANT: Your output MUST be only the final structured task prompt, formatted as plain text.
    Do NOT output any JSON, code blocks, or interpretations. Output the prompt text only."""

        response = client.models.generate_content(
            model=model, 
            contents=prompt,
           config=types.GenerateContentConfig(
               max_output_tokens=int(max_tokens),
                temperature=float(ai_temperature))
        )
        print(response.text,'--------------------prompt response')
        return response.text
    except Exception as e:
        error_message = str(e).lower()
        print("Exception caught:", error_message)

        if "api key not valid" in error_message or "invalid_argument" in error_message or "api_key_invalid" in error_message:
            return {"error": "Invalid API Key"}

    return "I'm sorry, I couldn't generate a response. Please try again."



@app.post("/chat")
async def upload_and_ask(
    file: UploadFile = File(...),
    system_prompt: str = Form(...),
    istructions: str = Form(...),
    example_output: str = Form(...),
    models:str = Form(...),
    api_key:str = Form(...),
    max_tokens: str = Form(...),
    ai_temperature: str = Form(...)
):
    
    """Upload a document and ask a question about it in one step"""
    try:
        print(max_tokens,'--------------max_tokensmax_tokensmax_tokensmax_tokens')
        print(ai_temperature,'-------------ai_temperatureai_temperatureai_temperature')
        if not any(file.filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS):
            return JSONResponse(
                {"error": "Unsupported file type. Please upload PDF, TXT, or DOCX files."}, 
                status_code=400
            )

        if api_key is None:
            return JSONResponse({"error":" Api key is missing"})
        file_content = await file.read()
        
        document_text = extract_document_text(file_content, file.filename)  
        
        prompt = CreatePrompt(system_prompt, istructions, example_output,models,api_key,document_text,max_tokens,ai_temperature)
        

        return JSONResponse({
            "success": True,
            "document_name": file.filename,
            "prompt": prompt
        })
    

    except ValueError as ve:
        return JSONResponse({"error": str(ve)}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"An error occurred: {str(e)}"}, status_code=500)


def AI_analysis_results(system_prompt, User_models,api_key,max_tokens,ai_temperature):
    """Generate response using Gemini"""
    try:
        client = genai.Client(api_key=api_key)
        
        full_prompt = f"""
    Question: {system_prompt}
"""
        
        response = client.models.generate_content(
            model=User_models, 
            contents=full_prompt,
              config=types.GenerateContentConfig(
                max_output_tokens=int(max_tokens),
                temperature=float(ai_temperature))
            
        )
        
        return response.text
    except Exception as e:
        print(f"Error generating response: {e}")
        return "I'm sorry, I couldn't generate a response. Please try again."
    

@app.post("/generate_response")
async def generate_response(
    prompt_result: str = Form(...),
    models:str = Form(...),
    api_key:str = Form(...),
    max_tokens: str = Form(...),
    ai_temperature: str = Form(...)
):
    """Upload a document and ask a question about it in one step"""
    try:
        
        if api_key is None:
            return JSONResponse({"error":" Api key is missing"})

        if prompt_result is None:
            return JSONResponse({"error":" enter prompt"})
        
        response=AI_analysis_results(prompt_result,models,api_key,max_tokens,ai_temperature)
        


        return JSONResponse({
           "response":response
        })
    

    except ValueError as ve:
        return JSONResponse({"error": str(ve)}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"An error occurred: {str(e)}"}, status_code=500)




def Optimize_analysis_results(response_result, User_models,api_key,max_tokens,ai_temperature):
    """Generate response using Gemini"""
    try:
        client = genai.Client(api_key=api_key)
        
        full_prompt = f"""
You are a highly skilled editor and prompt optimizer. Your task is to refine and optimize the following prompt data to enhance its clarity, conciseness, structure, and effectiveness. Here is the prompt data you will be working with:
 
<prompt_data>
{response_result}
</prompt_data>
 
Your objective is to improve the given prompt while adhering to these key principles:
 
1. Preserve all original information and context
2. Do not remove any meaningful content
3. Do not hallucinate or fabricate new information
4. Only rephrase or restructure existing content to make it more precise and professional
 
Follow these guidelines when optimizing the prompt:
 
1. Enhance clarity: Ensure each sentence is clear and unambiguous
2. Improve conciseness: Remove redundant words or phrases without losing meaning
3. Refine structure: Organize information logically and coherently
4. Boost effectiveness: Make the prompt more compelling and action-oriented
5. Polish language: Correct any grammatical errors and improve overall readability
6. Maintain professionalism: Use a formal, professional tone throughout
 
Your output should meet the following requirements:
 
1. Retain all original context and details from the input prompt
2. Contain no assumptions or information beyond what was provided
3. Demonstrate improved clarity, flow, grammar, and effectiveness
4. Be written in clear, professional English
"""
        
        response = client.models.generate_content(
            model=User_models, 
            contents=full_prompt,
            config=types.GenerateContentConfig(
                 max_output_tokens=int(max_tokens),
                temperature=float(ai_temperature))
        )
        
        return response.text
    except Exception as e:
        print(f"Error generating response: {e}")
        return "I'm sorry, I couldn't generate a response. Please try again."
    


@app.post("/optimize_response")
async def optimize_response(
    response_result: str = Form(...),
    models:str = Form(...),
    api_key:str = Form(...),
    max_tokens: str = Form(...),
    ai_temperature: str = Form(...)
):
    """Upload a document and ask a question about it in one step"""
    try:
        
        if api_key is None:
            return JSONResponse({"error":" Api key is missing"})

        if response_result is None:
            return JSONResponse({"error":" enter prompt"})
        
        response=Optimize_analysis_results(response_result,models,api_key,max_tokens,ai_temperature)
        


        return JSONResponse({
           "response":response
        })
    

    except ValueError as ve:
        return JSONResponse({"error": str(ve)}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"An error occurred: {str(e)}"}, status_code=500)



def Validate_API_KEY(model, api_key):
    
    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=model,
            contents="hello"
        )
        return response.text

    except Exception as e:
        error_message = str(e).lower()

        if "api key not valid" in error_message or "invalid_argument" in error_message or "api_key_invalid" in error_message:
            return {"error": "Invalid API Key"}
        
        if "resource_exhausted" in error_message and "free_tier" in error_message:
            return {"error": "This API key is not valid for paid or pro models."}
        else:
            return {"error": f"An unexpected error occurred: {e}"}



@app.post("/Validate_key")
async def Validate_key(
    models:str = Form(...),
    api_key:str = Form(...)
):
    try:
        if api_key is None:
            return JSONResponse({"error":" Api key is missing"})

        if models is None:
            return JSONResponse({"error":" enter models name"})
        
        response=Validate_API_KEY(models,api_key)
        
        return JSONResponse({
           "response":response
        })
    

    except ValueError as ve:
        return JSONResponse({"error": str(ve)}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"An error occurred: {str(e)}"}, status_code=500)


@app.get("/")
async def home():
    """Home endpoint with API information"""
    return JSONResponse({
        "message": "Simple Document Chat API",
        "description": "Upload a document and ask a question about it in one request",
        "endpoint": {
            "POST /chat": {
                "description": "Upload a document and ask a question",
                "parameters": {
                    "file": "Document file (PDF, TXT, or DOCX)",
                    "question": "Your question about the document"
                }
            }
        },
        "supported_formats": ["PDF", "TXT", "DOCX"]
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)