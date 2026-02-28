# Project Name
Taste Universe

## Project Overview
In this project, I used 52 food photos that I took myself. I turned them into a small “food universe” of moving points.
Each photo becomes one node. I also added simple tags (cuisine type) and my own interest score (1–10). The goal is to show my food preferences over time in a playful way.

## Technical Implementation
- Node.js: I wrote a small script to read my photo folder and create a data.json file (ID, date, tag, score).
<img width="540" height="636" alt="data" src="https://github.com/user-attachments/assets/e1a56f8d-3d19-483f-bf41-5eb67a0673f0" />

- p5.js: I used Perlin Noise to make the nodes float naturally. I used curveVertex to draw a timeline-like path between meals.
- UI: Simple interface with a paper texture and a Polaroid-style preview.

## How to play
- Floating Nodes**: Circle size represents my interest level; colours represent cuisine types.
- Click to Explore**: Click a node to view the corresponding photo and its attributes.
- Dynamic Connections**: Lines shift as nodes move, reflecting how memory and preference are not fixed.

## Ethics / Privacy
- I only used my own photos.
- data.json only includes basic information (no exact GPS, no personal details).
- Original photos are stored within this repository for visualization purposes only, and all sensitive metadata (like exact GPS locations) has been stripped during the Node.js extraction process.
