import express from 'express'
import cors from "cors";
import dotenv from "dotenv"

dotenv.config({path: ".env.local"})

const app = express()
const port = process.env.PORT
const key = process.env.FREEPIKS_API_KEY
app.use(cors())
app.use(express.json());

const aiPath = "https://api.freepik.com/v1/ai/text-to-image"

const body = {
  prompt: "The word Error on an easel",
  negative_prompt: "",
  num_inference_steps: 8,
  guidance_scale: 2,
  num_images: 1,
  image: {
    size: "standard",
  },
  // styling: {
  //   style: "sketch",
  // }
}

let aiImg = ""

async function makeRequest(userPrompt: string) {
  try {
    body.prompt = userPrompt;
    // Ensure the API key is defined before proceeding
    if (!key) {
      throw new Error("API key is missing.");
    }
      const response = await fetch(aiPath, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "X-Freepik-API-Key": key,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
      });
      
      if (!response.ok) {
          throw new Error(`Non-200 response: ${await response.text()}`);
      }
      
      const responseJSON = await response.json();
      aiImg = responseJSON.data.map((img) => {
        return "data:image/jpeg;base64," + img.base64
      })
    return aiImg
      
  } catch (error) {
      console.error(error);
  }
}


app.get("/api/book", (req, res) => {
  console.log("updating client")
  res.json({"pages": [
    {
      name: "Two ducks",
      position: 1,
      drawing: "",
      drawJSON: "",
      useDrawing: false,
      prompt: "two ducks eat a piece of bread",
      image: ""
    },
    {
      name: "3 dolla bill",
      position: 1,
      drawing: "",
      drawJSON: "",
      useDrawing: false,
      prompt: "A US dollar bill with a value of $3",
      image: ""
    },
  ]})
})

app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body
    console.log("Recieved Prompt: ", prompt)
    const images = await makeRequest(prompt)
  
    if (!images) {
      return res.status(401).json({ error: "Failed to get ai image" })
    }
  
    res.json({images: images})
  } catch (error) {
    console.error(error);
    console.log(req)
    res.status(400).json({ error: "Failed to get ai image" });
  }
})

app.listen(port, () => {console.log("server started on port ", port)})
