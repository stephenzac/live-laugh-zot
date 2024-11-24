# Live, Laugh, Zot

## 🏆 1st Place at ICSSC's WebJam 2024 🏆

## 🧐 What is Live, Laugh, Zot?
Live, Laugh, Zot is a way for you to collaborate with your roommates in *real-time* on things like chores, groceries, and resolving your conflicts! We aim to facilitate simple collaboration and teamwork between those organizing their living situation with each other.
- Engineered and hacked by Yoav Feigenbaum, Michelle Lee, and Stephen Zacarias

## 💭 Problems we faced
- Finding which Generative AI API to use
	- Heavy rate-limiting on free API tiers would heavily hinder development time
- Storing our web app's data
	- We considered using Socket.IO, but which would have required more manual setup of collections of households and data modeling
	- Google's Cloud Firestore fit perfectly into our goal of real-time updates for collaboration, and provided easy setup/use for quick development times
- Modeling our web app's data
	- TypeScript allowed us to model our data in both front end and back end code, and to easily catch errors during development
- Authentication
	- Password hashing + salting allowed us to securely store and check passwords, and a simple Zustand store helped us store authentication state on the client!
- Implementing the cost splitter
	- Given the limited time frame, we weren't able to fully finish this - things like adding payments to outstanding bills would have to lead to cascading changes in other database entries - a challenge for our NoSQL store

## 🧠 What we learned
- Learning how to use Firebase, and achieving actual real-time changes in our application was very rewarding
- Fitting TypeScript into real-world applications
- Becoming better team players!
	- There's always room to improve your work ethic and be a better problem-solver
	- Communication of goals and the fine details
	- Coordination of reviewing PRs and pushing to/pulling from main

## ⚙️ Technologies and Tools we used

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)  ![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)  ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)  ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)  
