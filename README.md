# Project Name
Taste Universe

## Project Overview
This interactive project transforms 52 personal food photos into a dynamic, living "universe." 
By extracting lightweight metadata (e.g., date) and adding my own tags and subjective interest scores (1–10), I created a system where culinary memories become floating nodes in a connected web of experiences.

## Technical Implementation
- **Data Collection / Processing**: A custom **Node.js** script parses my photo folder and generates a minimised `data.json` (IDs, dates, cuisine tags, interest score).
- **Generative Visualisation**: Built with **p5.js**, using **Perlin Noise** for organic motion and **curveVertex** to draw a chronological path between meals.
- **UI Design**: A minimalist, paper-textured interface with "Polaroid" style previews.

## Interaction Guide
- **Floating Nodes**: Circle size represents my interest level; colours represent cuisine types.
- **Click to Explore**: Click a node to view the corresponding photo and its attributes.
- **Dynamic Connections**: Lines shift as nodes move, reflecting how memory and preference are not fixed.

## Ethics / Privacy
- Uses **only my own photos**.
- The exported `data.json` contains **minimised, non-sensitive fields** (no precise GPS coordinates or personal identifiers).
- Original images and full metadata remain **local** and are not uploaded publicly.
