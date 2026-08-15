import { Gender } from "./db";

/**
 * Party-specific character content for the Tahoe trip (Sep 3–5, 2026).
 * The murder takes place Friday, Sep 4, between roughly 5:15 and 6:40 PM,
 * while the group is back at the cabin cleaning up after the hike.
 *
 * Every character gets a `real_motive` — including the nine who aren't the
 * killer. That's deliberate: if only one row had a motive, the database
 * itself would give the answer away.
 *
 * Several non-killer characters carry deliberate soft spots in their alibi
 * (unwitnessed gaps, fuzzy timing, a receipt that doesn't quite line up) so
 * the killer isn't the only one with an imperfect story.
 */
export type RosterContent = {
  name: string;
  gender: Gender;
  bio: string;
  relationship_to_scooby: string;
  alibi: string;
  secret: string;
  real_motive: string;
};

export const ROSTER_CONTENT: RosterContent[] = [
  {
    name: "Fred Jones",
    gender: "male",
    bio: "Self-appointed captain of the Tahoe trip. Fred built the entire weekend agenda in a shared doc nobody asked for, color-coded it, and printed a copy. He hauled the pong table up himself and had it set up before he'd unpacked a single bag. If there's a plan, Fred made it. If the plan falls apart, Fred will insist it didn't.",
    relationship_to_scooby:
      "Fred and Scooby have been road-trip partners for years — Scooby always rode shotgun, Fred always pretended to be annoyed about the dog hair. Lately, though, Fred's been the one saying \"not now, buddy\" every time Scooby asked for a minute alone to talk.",
    alibi:
      "Got back from the hike around 4:30, showered fast, and went straight to the living room to set up the pong table. I was down there until dinner — 5:15 to 6:30, easy. Ask anyone who walked through; I was measuring cup spacing like it mattered. I did step out to my car once around 5:40 to grab the extra balls out of the trunk. Took maybe five minutes. Ten, tops.",
    secret:
      "You dropped $1,900 at the casino Thursday night. Not \"a rough night\" — rent money. Scooby was standing behind you when the last hand went bad, and he's the only one who saw the number on the screen. Friday afternoon he told you, gently, that you should tell the group before you asked anyone to spot you for the Costco run. You told him you'd handle it.",
    real_motive:
      "Scooby was going to bring up the $1,900 at dinner — not to humiliate you, but because he genuinely thought you needed help. You could not survive being the guy who plans everyone's weekend and can't cover his own $50.",
  },
  {
    name: "Daphne Blake",
    gender: "female",
    bio: "Arrived with three bags for a two-night trip and zero apologies. Daphne is the one who finds the good bar, talks the group into the better table, and somehow always ends up with the best photo of the weekend. She's also tougher than she looks — second person to the top on Friday's hike, and she didn't complain once.",
    relationship_to_scooby:
      "Scooby was Daphne's designated hype man. He was the only one who never gave her grief about the luggage, and she was the only one who'd share her fries with him without being asked twice.",
    alibi:
      "I came back from the hike soaked, so I got the Bedroom Suite 2 shower first — about 4:45 to maybe 5:20. Then I did my hair and makeup in that room with the door mostly shut and music going. I didn't hear anything, which I know isn't helpful. I came downstairs around 6:15 and the garlic bread was already out.",
    secret:
      "Your card got declined at the casino Thursday and you covered it by quietly moving $400 out of the shared trip fund you volunteered to hold. You told yourself you'd put it back before anyone reconciled the Costco receipt. Scooby watched you do it from the kitchen doorway Friday afternoon and didn't say a word. He just looked at you.",
    real_motive:
      "Scooby knew about the trip fund. He was the kind of friend who'd give you until Sunday to fix it yourself and then tell the truth anyway. You couldn't take that chance.",
  },
  {
    name: "Velma Dinkley",
    gender: "female",
    bio: "The person who actually read the rental agreement. Velma knew check-out was 11:00 (not the 10:30 everyone was told), knew where the fire extinguisher was, and knew exactly how much everyone still owed. She spent most of Friday afternoon on the deck with a book, which is her favorite kind of party.",
    relationship_to_scooby:
      "Velma and Scooby had a running bit where he'd pretend to understand what she was reading and she'd pretend to believe him. Underneath it, he was one of the only people who asked her follow-up questions and actually meant them.",
    alibi:
      "I was on the back deck from about 5:00 on, with my book and a Hazy Little Thing. I had a clear view of the driveway the whole time — I saw Fred go out to his car, that part's true. I did not see who came in and out of the kitchen, because the deck door was behind me and my back was to it.",
    secret:
      "You've been quietly keeping a spreadsheet of what everyone actually paid versus what they owe, and two people on this trip are into the group for real money. You haven't said anything because you're not sure whether that makes you responsible or just nosy. Scooby asked you Friday afternoon whether you were going to bring it up at dinner.",
    real_motive:
      "You've spent this whole weekend being the only person who sees clearly and the only person nobody listens to. Scooby was going to make you say it out loud in front of everyone, and then it would be your problem instead of theirs.",
  },
  {
    name: "Shaggy Rogers",
    gender: "male",
    bio: "Ran point on the Costco run and takes that responsibility more seriously than anything else in his life. Shaggy knows exactly how many High Noons are left, where the good chips got hidden, and who's been eating the trail mix that was clearly labeled for the hike.",
    relationship_to_scooby:
      "Scooby was Shaggy's best friend, full stop. Same plate, same couch, same snack schedule for as long as anyone's known them. If you saw one of them at this cabin, the other was about four feet away.",
    alibi:
      "I was in the kitchen basically the whole time — from when we got back until dinner. Pulling the chicken and sausage out, getting the pasta salad into a real bowl, all that. Scooby came in around 5:15 and grabbed a bagel. He seemed fine. He was fine. I turned around to deal with the garlic bread in the oven, and when I looked back he'd gone somewhere. That's the last time I saw him.",
    secret:
      "Scooby told you Thursday night that he was moving — actually moving, out of state, in October. He hadn't told anyone else and he made you promise. You spent all of Friday trying to talk him out of it and you were not handling it well. Two different people heard you raise your voice at him on the trail.",
    real_motive:
      "He was leaving. After everything, he was just going to go, and he expected you to be happy for him. You weren't.",
  },
  {
    name: "Scrappy-Doo",
    gender: "male",
    bio: "Smallest person on the trip, loudest voice in every room. Scrappy took the surprise hike as a personal competition, summited first, and has mentioned it eleven times since. He's the reason there's a memory-foam mattress in the living room instead of a fight about bedrooms.",
    relationship_to_scooby:
      "Scooby is Scrappy's uncle and his entire personality. Scrappy has been defending Scooby from things Scooby did not need defending from since roughly birth.",
    alibi:
      "I stayed out on the trail after everybody turned back — wanted to hit the second overlook. Got back to the cabin somewhere around 5:45, maybe 5:50. Nobody was in the living room when I came in, which I thought was weird. I went straight to the outdoor shower because I was disgusting, then got dressed on the living room mattress.",
    secret:
      "You and Scooby had a real fight on the trail Friday — not the usual bit. He told you, in front of two other people, that you're exhausting and that he's tired of managing you. You've been telling everyone since that it was nothing.",
    real_motive:
      "He said it in front of people. Your whole life you've been the kid whose uncle sticks up for him, and he took that away on a hiking trail with witnesses standing right there.",
  },
  {
    name: "Emile Mondavarious",
    gender: "male",
    bio: "Put the whole cabin on his card and has mentioned the reservation number at least three times. Emile is gracious, generous, and extremely comfortable being the person everyone owes money to. He did not go on the hike.",
    relationship_to_scooby:
      "Emile likes Scooby the way a host likes a good guest — warmly, and at a slight distance. Scooby was the only one who ever asked Emile whether he was actually having a good time.",
    alibi:
      "I stayed at the cabin while everyone hiked. Took a call, read on the front porch, started the grill around 5:30 so the coals would be ready. I was in and out of the kitchen more than once, yes. I don't have anyone who can account for me between about four and five-thirty, because everyone else was on a mountain.",
    secret:
      "The total you told everyone the cabin cost is not what the cabin cost. You booked a cheaper unit and pocketed the difference — a little over $300 — because you are nowhere near as liquid as this group assumes. Scooby saw the real confirmation email over your shoulder Thursday.",
    real_motive:
      "The entire way this group treats you is built on them believing you're the one who can always afford it. Scooby had proof that you can't.",
  },
  {
    name: "The Creeper",
    gender: "male",
    bio: "Nobody's totally sure who invited him. He drove up separately, he doesn't drink what everyone else is drinking, and he's been on the edge of every group photo. He carried more weight up the trail than anyone and said maybe nine words the whole way.",
    relationship_to_scooby:
      "Scooby was the only person on this trip who talked to him like a normal person. Made a point of it, actually — sat next to him at Nevada Beach on Thursday when nobody else would.",
    alibi:
      "I don't have one you'll like. I got back before the rest of you, around 4:15, and went for a walk down toward the water alone. No, nobody saw me. I came back in through the side door around six and went to the living room. I'm aware of how that sounds.",
    secret:
      "You're not who this group thinks you are, and Scooby worked it out Thursday at the beach — the name you gave doesn't match the one on the reservation. Scooby never told anyone. He told you he wasn't going to. You were never quite sure you believed him.",
    real_motive:
      "You needed one weekend where nobody looked too closely, and exactly one person looked.",
  },
  {
    name: "Sheriff Bronson Stone",
    gender: "male",
    bio: "Loudly skeptical of this entire weekend and the first one up every morning making the coffee. Bronson ran the grill Thursday night, drove the run into town nobody else wanted, and complains about all of it constantly.",
    relationship_to_scooby:
      "Bronson calls Scooby \"that dog\" in a tone that fools absolutely nobody. They're the two who end up doing dishes together at 1 a.m.",
    alibi:
      "Made a run into Stateline around five to get more ice — we were out and the chest was warm. Gas station on the main drag. I've got the receipt somewhere, probably still in the truck. I was back by quarter to six and started bringing things out to the grill.",
    secret:
      "That receipt is time-stamped 5:04 PM, and the store is nine minutes from this cabin. You were not gone forty minutes buying ice. You were sitting in your truck in the driveway working up the nerve to tell Scooby that you're the one who called his landlord last month.",
    real_motive:
      "He was about to find out it was you, and he was the one person here whose opinion of you actually landed.",
  },
  {
    name: 'Marcie Fleach ("Hot Dog Water")',
    gender: "female",
    bio: "Earned the nickname on a camping trip years ago and has never once tried to shake it. Marcie is the only person who brought a first aid kit, knows how to actually read the grill's temperature gauge, and reorganized the entire ice chest without being asked.",
    relationship_to_scooby:
      "Marcie was on the outside of this group for a long time, and Scooby was the first one who made room for her. She's never forgotten it, and she's never quite gotten over how easy it was for him.",
    alibi:
      "I was in the kitchen with Shaggy for most of it, prepping the salads and getting the pasta salad plated. I stepped out to the garage around 5:30 for the second bag of ice and stayed a few minutes cutting fruit for Saturday, because there was no counter space left. When I came back, Shaggy was still there and Scooby wasn't.",
    secret:
      "You've been in love with someone on this trip for two years, and Scooby was the only one who knew. He'd been telling you all weekend to just say it. Friday afternoon he told you that if you didn't say something by the end of dinner, he'd say it for you — and he was smiling when he said it, which somehow made it worse.",
    real_motive:
      "He was going to say it out loud in front of everyone, and he honestly believed he was doing you a favor.",
  },
  {
    name: "Angel Dynamite (Cassidy Williams)",
    gender: "female",
    bio: "Controls the aux and has never once surrendered it. Angel ran casino night on Thursday, knows bartenders at three different places in Stateline by name, and got the whole group into a table that was supposedly full.",
    relationship_to_scooby:
      "Scooby was Angel's favorite audience — she'd try new bits on him first because he laughed at everything. He was also, quietly, the only one she'd ever told anything real to.",
    alibi:
      "I was in the living room getting ready on the sofa-bed side, doing my makeup with the speaker going. Somebody's stuff was all over the other half so I had maybe two feet of space. I was there from about five until people started coming down. The music was loud. I'll be honest — I wouldn't have heard a thing.",
    secret:
      "You've been on this trip as a version of yourself that isn't quite true. The job you told everyone about ended in March. You've been out of work since, and this entire weekend went on a credit card you can't pay. Scooby knew, because he ran into you at the unemployment office in April and you begged him to keep it to himself.",
    real_motive:
      "You built a whole weekend around being the person who has it together. He was the one crack in it.",
  },
];
