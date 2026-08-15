import { TraitVector } from "./traits";

export type QuizOption = {
  key: "A" | "B" | "C" | "D";
  text: string;
  weights: Partial<TraitVector>;
};

export type QuizQuestion = {
  id: number;
  prompt: string;
  options: QuizOption[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: "A door creaks open at the end of a dark hallway. What's your move?",
    options: [
      { key: "A", text: "March in first — someone's got to.", weights: { bravery: 3 } },
      { key: "B", text: "Check the hinges and floor scuffs for clues before stepping through.", weights: { logic: 3 } },
      { key: "C", text: "Grab a snack and suggest circling back after a breather.", weights: { comfort: 3 } },
      { key: "D", text: "Make sure nobody goes in alone — round up the group first.", weights: { loyalty: 3, charm: 1 } },
    ],
  },
  {
    id: 2,
    prompt: "Pick your party trick.",
    options: [
      { key: "A", text: "A toast that has the whole room laughing in ten seconds.", weights: { charm: 3 } },
      { key: "B", text: "Solving the room's puzzle before anyone else even reads the clue.", weights: { logic: 2, curiosity: 1 } },
      { key: "C", text: "Finding the best snack table in the building, blindfolded.", weights: { comfort: 3 } },
      { key: "D", text: "Getting a photo where literally nobody's left out.", weights: { loyalty: 2, charm: 1 } },
    ],
  },
  {
    id: 3,
    prompt: "You find a locked chest. What's your first instinct?",
    options: [
      { key: "A", text: "Pry it open — worry about consequences later.", weights: { bravery: 3 } },
      { key: "B", text: "Look for a key, a combination, anything logical before forcing it.", weights: { logic: 3 } },
      { key: "C", text: "Wonder out loud what's inside and start theorizing wild possibilities.", weights: { curiosity: 3 } },
      { key: "D", text: "Ask if anyone else wants to open it together.", weights: { loyalty: 2, charm: 1 } },
    ],
  },
  {
    id: 4,
    prompt: "Your friend swears they saw a ghost. Your reaction?",
    options: [
      { key: "A", text: "\"Let's go find it.\"", weights: { bravery: 3, curiosity: 1 } },
      { key: "B", text: "\"Interesting — what exactly did you see, and when?\"", weights: { logic: 3 } },
      { key: "C", text: "\"Cool story. Anyway, did anyone bring snacks?\"", weights: { comfort: 3 } },
      { key: "D", text: "\"I believe you. I'm not leaving your side tonight.\"", weights: { loyalty: 3 } },
    ],
  },
  {
    id: 5,
    prompt: "Choose a role in a group project.",
    options: [
      { key: "A", text: "The one who convinces everyone the plan will work.", weights: { charm: 3 } },
      { key: "B", text: "The one quietly cross-checking every fact before it ships.", weights: { logic: 3 } },
      { key: "C", text: "The one asking \"but what if we tried something completely different?\"", weights: { curiosity: 3 } },
      { key: "D", text: "The one making sure the quietest person's idea gets heard.", weights: { loyalty: 3 } },
    ],
  },
  {
    id: 6,
    prompt: "It's 2am and something is clearly wrong in the house. You:",
    options: [
      { key: "A", text: "Go check it out immediately, no hesitation.", weights: { bravery: 3 } },
      { key: "B", text: "Stay put — no good ever comes from investigating strange noises at 2am.", weights: { comfort: 3 } },
      { key: "C", text: "Wake everyone up so no one faces it alone.", weights: { loyalty: 2, bravery: 1 } },
      { key: "D", text: "Start piecing together what could logically be causing it before moving.", weights: { logic: 3 } },
    ],
  },
  {
    id: 7,
    prompt: "Pick a compliment you'd actually want to hear.",
    options: [
      { key: "A", text: "\"You're the bravest person I know.\"", weights: { bravery: 3 } },
      { key: "B", text: "\"You always figure it out.\"", weights: { logic: 3 } },
      { key: "C", text: "\"You light up every room you're in.\"", weights: { charm: 3 } },
      { key: "D", text: "\"You'd never let a friend down.\"", weights: { loyalty: 3 } },
    ],
  },
  {
    id: 8,
    prompt: "A mystery guest at the party seems to be hiding something. You:",
    options: [
      { key: "A", text: "Confront them directly — better to know now.", weights: { bravery: 2, charm: 1 } },
      { key: "B", text: "Watch quietly and piece together the inconsistencies over the night.", weights: { logic: 2, curiosity: 2 } },
      { key: "C", text: "Let it go — not everything needs solving tonight.", weights: { comfort: 3 } },
      { key: "D", text: "Try to make them feel comfortable enough to open up to you.", weights: { charm: 2, loyalty: 1 } },
    ],
  },
  {
    id: 9,
    prompt: "Your ideal vacation:",
    options: [
      { key: "A", text: "Something with real risk — cliffs, caves, open water.", weights: { bravery: 3 } },
      { key: "B", text: "A place with a mystery, legend, or unsolved case attached.", weights: { curiosity: 3 } },
      { key: "C", text: "Somewhere with incredible food and zero itinerary.", weights: { comfort: 3 } },
      { key: "D", text: "Wherever your people are going — the destination matters less.", weights: { loyalty: 3 } },
    ],
  },
  {
    id: 10,
    prompt: "When a plan falls apart mid-execution, you:",
    options: [
      { key: "A", text: "Improvise and push forward anyway.", weights: { bravery: 2, curiosity: 1 } },
      { key: "B", text: "Stop and recalculate before doing anything else.", weights: { logic: 3 } },
      { key: "C", text: "Suggest regrouping over food to think it through.", weights: { comfort: 2, charm: 1 } },
      { key: "D", text: "Check that everyone's okay before worrying about the plan.", weights: { loyalty: 3 } },
    ],
  },
  {
    id: 11,
    prompt: "If a friend had to compliment how you communicate with people, which one sounds most like you?",
    options: [
      { key: "A", text: "\"You could talk your way out of anything.\"", weights: { charm: 3 } },
      { key: "B", text: "\"You ask better questions than anyone I know.\"", weights: { curiosity: 2, logic: 1 } },
      { key: "C", text: "\"You always know how to calm people down.\"", weights: { loyalty: 2, comfort: 1 } },
      { key: "D", text: "\"You don't talk much, but people listen when you do.\"", weights: { logic: 2, bravery: 1 } },
    ],
  },
  {
    id: 12,
    prompt: "Last one: what's your role when the group finally corners the culprit?",
    options: [
      { key: "A", text: "First through the door, no backup needed.", weights: { bravery: 3 } },
      { key: "B", text: "The one holding the evidence that makes the case airtight.", weights: { logic: 3 } },
      { key: "C", text: "The one narrating the whole thing like it's the best story ever told.", weights: { charm: 3 } },
      { key: "D", text: "The one standing closest to your friends, no matter what happens next.", weights: { loyalty: 3 } },
    ],
  },
];
