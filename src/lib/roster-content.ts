import { Gender } from "./db";

/**
 * FINAL character content, sourced verbatim from the Player Packets and
 * Story Bible documents (Tahoe trip, Sep 3–5, 2026). Do not paraphrase when
 * editing this file — the packets are printed and read aloud word-for-word
 * at the event, so the site's copy needs to match exactly.
 *
 * Round structure (for context, not enforced by the site — the live rounds
 * are run in person by the GM):
 *   Round 1 — Alibi read aloud to one partner
 *   Round 3 — Secret read aloud to one partner
 *   Round 5 — Motive read aloud to one partner
 * Every field is self-contained: a listener never needs another field to
 * make sense of what they're hearing, since in play a character's three
 * private fields may go to three different people.
 *
 * `motive` is the Round 5 script — every character has one, killer and
 * non-killer alike, and it's shown on the guest's own "My Character" page
 * like alibi/secret. `real_motive` is a completely different thing: the
 * true, hidden reason, established only for the killer (Daphne), never
 * rendered anywhere in the app, and handed to her physically by the host
 * the night of the event. Non-killer characters have no real_motive at all
 * — their stated Round 5 motive already is the real one.
 */
export type RosterContent = {
  name: string;
  gender: Gender;
  bio: string;
  personality: string;
  life_outside_weekend: string;
  relationship_to_scooby: string;
  alibi: string;
  secret: string;
  motive: string;
  real_motive?: string;
};

export const ROSTER_CONTENT: RosterContent[] = [
  {
    name: "Daphne Blake",
    gender: "female",
    bio: "I arrived with three bags for a two-night trip and I'm not sorry about it. I'm the one who finds the good bar, talks the group into the better table, and somehow always ends up with the best photo of the weekend. I'm also tougher than I look — I was second to the top on Friday's hike, and I didn't complain once.",
    personality:
      "I walk into a room like I already know how the night's going to end. I'm genuinely fun to be around, and genuinely capable when it counts. I notice everything about how a room is arranged, and I don't say anything about half of it.",
    life_outside_weekend:
      "I work in something design-adjacent — ask me twice and I'll probably describe it differently both times. I've moved apartments four times in three years. I run the group's shared photo album, and I run it with an iron fist.",
    relationship_to_scooby:
      "Scooby was my designated hype man. He was the only one who never gave me grief about the luggage, and I was the only one who'd share my fries with him without being asked twice.",
    alibi:
      "I got the to the shower first, somewhere around 4:45 to 5:10. After that I was doing my hair and makeup with the door shut and music going. At some point — maybe 5:20, I wasn't watching the clock — I stepped out through the side door for a few minutes of air. Fifteen minutes, maybe twenty, I really couldn't tell you. I came back in, finished getting ready, and came downstairs around 6:15.",
    secret:
      "The Creeper is my half-brother. My dad's first marriage — he was cut off from the family for reasons I've honestly never fully worked out myself. Scooby invited him to Tahoe this weekend. He did it himself, without asking me first. No warning, no permission. I didn't get a say in any of it.",
    motive:
      "Scooby got it into his head that he'd fixed something in my family for me — something private, something I never asked him to touch. Friday afternoon he told me he was going to lay the whole thing out in front of everyone at dinner tonight. He wasn't asking me. He'd already decided. Parts of my life I haven't even sorted out for myself yet were about to become dinner conversation for ten people, and there was nothing I could say to talk him out of it.",
    real_motive:
      "Scooby has known about Daphne's estranged half-brother for years — she told him once, off-hand, back when the two of them were closer than she's been with anyone since. He never let it go. Certain he was helping, Scooby tracked The Creeper down and invited him to Tahoe himself — no warning to Daphne, no permission. He planned to explain everything at dinner: that he'd done it out of love, that families shouldn't stay broken over something that could still be fixed. Daphne spent the whole weekend blindsided. Friday afternoon Scooby finally told her what he'd done — not asking, just telling her it was happening. She followed him to the dock to stop him. It went wrong faster than she meant it to.",
  },
  {
    name: "The Creeper",
    gender: "male",
    bio: "Honestly, I don't think anyone's totally sure who invited me. I drove up separately, I don't drink what everyone else is drinking, and I've ended up on the edge of every group photo. I carried more weight up the trail than anyone else and I think I said maybe nine words the whole way.",
    personality:
      "I'm quiet. I notice things. I show up for the hard physical parts of a trip without anyone having to ask me twice. I'm not big on small talk. I don't think I need to be.",
    life_outside_weekend:
      "I sort of came into this friend group sideways a few years back and just never stopped getting invited. I keep to myself about the details. I don't think anyone here has actually been to where I live.",
    relationship_to_scooby:
      "Scooby was the only person on this trip who talked to me like a normal person. He made a point of it, actually — sat next to me at Nevada Beach on Thursday when nobody else would.",
    alibi:
      "I got back to the cabin before the rest of you, around 4:15, and I went for a walk toward the water by myself — the public shoreline, not the dock. Nobody saw me out there. I came back in through the side door sometime around six. I couldn't tell you exactly when — I wasn't checking the time.",
    secret:
      "Daphne's my half-sister. Scooby's the one who reached out to me — tracked me down, told me he thought I deserved a shot at being back in her life, and I said yes. I wanted this. Nobody forced my hand on it — if anything, Scooby did me a favor. I just hoped Daphne already knew I was coming. Turned out she didn't.",
    motive:
      "Scooby stuck his nose into a family situation of mine and decided he knew how to fix it better than I did. He didn't ask me how I wanted it handled — he just set the whole thing in motion and told me, Friday, that dinner tonight was where he'd explain himself to everyone. Not ask. Tell. Whatever he thought he was doing for me, it wasn't his to announce to a room full of people I barely know.",
  },
  {
    name: "Shaggy Rogers",
    gender: "male",
    bio: "I ran point on the Costco run, and I take that more seriously than almost anything else in my life. I know exactly how many High Noons are left, where the good chips got hidden, and who's been eating the trail mix that was clearly labeled for the hike.",
    personality:
      "I avoid conflict. I avoid danger. I will not avoid food. I notice who's okay and who isn't — I just don't usually say anything about it until I have to. Loyalty's basically my whole personality.",
    life_outside_weekend:
      "I've got a job with pretty flexible hours — even I'm not totally sure what my schedule looks like some weeks. I've lived with Scooby, in one setup or another, since college.",
    relationship_to_scooby:
      "Scooby's my best friend, full stop. Same plate, same couch, same snack schedule for years. If you saw one of us at this cabin, the other one was about four feet away.",
    alibi:
      "I was in the kitchen the entire time, start to finish — Marcie was right there with me almost the whole stretch, in and out for ice and stuff, but I never left. Scooby came through around 5:15, grabbed a bagel, seemed totally normal. I was pulling things together for dinner right up until people started coming down. I didn't step out once.",
    secret:
      "Scooby told me Thursday night that he's moving — actually moving, out of state, in October. He hadn't told anyone else. He made me promise not to either. Then Friday he told me he'd changed his mind — he was going to tell everyone himself, tonight, at dinner. He didn't really ask how I felt about that. He just told me it was happening.",
    motive:
      "Scooby told me something Thursday night that knocked the wind out of me — news about him that changes everything about how much longer he's even going to be part of my life the way he has been. He'd been keeping it quiet, but Friday he told me he was going to put it out there in front of the whole group at dinner tonight. I wasn't ready to hear it said out loud again, let alone to everyone. I wasn't handling it well on the trail Friday. A couple people heard me raise my voice at him about it.",
  },
  {
    name: "Sheriff Bronson Stone",
    gender: "male",
    bio: "I've been pretty loudly skeptical of this whole weekend, and I'm also the first one up every morning making the coffee, so take that for what it's worth. I ran the grill Thursday night, I drove the supply run nobody else wanted to make, and I've complained about all of it the entire time.",
    personality:
      "I complain about everything and I show up for all of it anyway. I come across gruff, and mostly I am, but I'm dependable under it — I'd rather prove I care than say it out loud.",
    life_outside_weekend:
      "I work something in law enforcement, or close enough to it. I've got strong, specific opinions about how everyone else in this group drives, and I will share them unprompted.",
    relationship_to_scooby:
      "I call him 'that dog' in a tone that fools absolutely nobody. We're the two who always end up doing the dishes together at 1 in the morning.",
    alibi:
      "I made a run into Stateline around five for ice — the chest was warm, we were out. My receipt's timestamped 5:04, still got it in the truck if anyone wants to see it. Store's a straight shot, maybe seven or eight minutes each way. But I didn't actually walk back in through that kitchen door until almost quarter to six. I stopped to fix a strap on the cooler in the truck bed before I came in — took longer than it should have, if I'm honest.",
    secret:
      "When I was about twenty-five, a buddy's little brother started running with a bad crowd — all the signs were there — and I told myself it wasn't my place to say anything. Six months later he was in real trouble, the kind you don't just walk back from. I've never told anyone that's the actual reason I started looking out for Scrappy the way I do. It's got nothing to do with Scooby. It's about not making that same mistake twice.",
    motive:
      "I heard he called Scrappy exhausting on the trail — told him he was tired of managing him, right in front of Fred and Angel. That's not something you say to that kid, not around me. I found Scooby by the woodpile Friday evening and told him so myself. Kept my voice down. Made sure he heard me anyway.",
  },
  {
    name: "Angel Dynamite (Cassidy Williams)",
    gender: "female",
    bio: "I control the aux and I've never once given it up. I ran casino night Thursday, I know bartenders at three different places in Stateline by name, and I got us into a table that was supposedly full.",
    personality:
      "I don't really do quiet rooms. I'm the first one dancing, the last one talked into anything, and apparently pretty good in an actual crisis. Once I decide I like someone, I commit fast and I commit hard.",
    life_outside_weekend:
      "I met this group through Daphne freshman year and never really left the group chat. I tell people I'm 'in marketing.' I have strong opinions about everyone else's LinkedIn photos. I've got a rescue greyhound named Biscuit.",
    relationship_to_scooby:
      "Scooby was my favorite audience. I'd try new bits on him first because he laughed at literally everything. He was also, quietly, one of the only people I've ever told anything real to.",
    alibi:
      "I was in the living room getting ready on the sofa-bed side from about five on — hair, makeup, speaker going the whole time. Nobody was with me. I didn't leave, but I also can't really prove that to anyone — the music was loud enough that I wouldn't have noticed someone looking for me either.",
    secret:
      "Velma and I have secretly been together for months. Nobody in the group knows. Scooby knew, and he'd been gently telling me all weekend that I should be the one to say it myself — not that he'd do it for me, just that he thought I was more ready than I was giving myself credit for.",
    motive:
      "Scooby knew about something personal in my life that I hadn't gone public with yet — a relationship I've been keeping quiet. Honestly, though, I wasn't scared of him saying anything. I was already planning to tell people soon; this weekend just wasn't the moment I'd picked. Friday he mentioned it might come out sideways if I waited too long, and he was probably right. It didn't feel like pressure. It just felt like Scooby.",
  },
  {
    name: "Fred Jones",
    gender: "male",
    bio: "I'm the self-appointed captain of this Tahoe trip. I built the entire weekend agenda in a shared doc nobody asked for, color-coded it, and printed a copy. I hauled the pong table up myself before I'd even unpacked a bag. If there's a plan, I made it. If the plan falls apart, I will insist that it didn't.",
    personality:
      "I need a plan the way other people need coffee. I'm loyal to a fault, and I'm genuinely bad at admitting when something's actually wrong.",
    life_outside_weekend:
      "I run point on every group trip, every fantasy league, basically anything with logistics. I've got a shared calendar with color categories I will absolutely explain to you if you let me. I'm seeing someone the group's heard about but never actually met.",
    relationship_to_scooby:
      "Scooby and I have been road-trip partners for years — he always rode shotgun, I always pretended to be annoyed about the dog hair. Lately, though, I've been the one saying 'not now, buddy' every time he tried to get a minute alone with me.",
    alibi:
      "I got back from the hike around 4:30, showered fast, and went straight to the living room to set up the pong table. I was down there from about 5:15 to 6:30, front of the house the whole time. I did step out to my car once, around 5:40, for the extra balls in the trunk. Ten minutes. Maybe closer to twelve, if I'm being honest.",
    secret:
      "Marcie and I have spent months quietly helping Scooby manage a health diagnosis he wasn't ready to tell the group about. Whatever he decided to do with it — tell everyone, tell no one, wait — I was always going to back him. There was never a version of this where I resented him for any of it.",
    motive:
      "Honestly, I'd been half-expecting Scooby to bring his diagnosis up this trip — he'd hinted at it, said something about wanting to 'get it over with' before we all went home. I told him I thought he should wait, that dinner in front of everyone wasn't the right setting. I've been worried all weekend that I said the wrong thing to him about the timing. It's been stressful. It never made me angry at him.",
  },
  {
    name: "Scrappy-Doo",
    gender: "male",
    bio: "I'm the smallest person on this trip and probably the loudest voice in every room. I took the surprise hike as a personal competition, summited first, and I've brought it up maybe eleven times since. I'm also the reason there's a memory-foam mattress in the living room instead of a fight about who gets which bedroom.",
    personality:
      "I treat pretty much every activity like a contest I've already decided to win, and most of the time I do, mostly through sheer refusal to stop. I'm protective to a fault, especially when it comes to Scooby.",
    life_outside_weekend:
      "I'm the youngest in this group by a few years, and I've spent my whole life making up the difference in volume. I play in a rec league that takes itself way too seriously. I've been 'about to move out of my uncle's spare room' for over a year now.",
    relationship_to_scooby:
      "Scooby's my uncle, and I've basically spent my whole life being introduced as 'Scooby's nephew' before I'm anything else. I don't mind it, most of the time. I've just been defending him from things he never actually needed defending from since I could talk.",
    alibi:
      "I split off from the group at the fork to hit the second overlook — Fred actually saw me go, he can back that up. It's maybe fifteen minutes each way from there. Bronson was pulling in from the ice run right around when I got back to the cabin, so he saw me come in too — somewhere around 5:20, 5:25. Nobody was in the living room when I walked in, which I thought was weird. Outdoor shower, then I got dressed on the mattress.",
    secret:
      "Bronson's the only person who's ever told me I'm more than 'Scooby's nephew.' Scooby found out about it somehow — probably from Bronson himself — and told me Friday he wanted to bring it up at dinner. Said it'd be a nice thing, a toast, something sweet. I told him I'd rather he didn't. He said he'd already been thinking about what he wanted to say anyway.",
    motive:
      "Scooby and I had a real moment on the trail Friday. He called me exhausting, said he was tired of managing me — right in front of two other people. It stung. It embarrassed me, honestly. It didn't make me want to hurt him.",
  },
  {
    name: 'Marcie Fleach ("Hot Dog Water")',
    gender: "female",
    bio: "I earned the nickname 'Hot Dog Water' on a camping trip years ago, and I've honestly given up trying to shake it at this point. I'm the only one who brought a first aid kit, I actually know how to read the grill's temperature gauge, and I reorganized the entire ice chest without anyone asking me to.",
    personality:
      "I'm the one who actually knows how things work — hands-on, practical, I just figure it out. I don't say much until I'm sure. When I do say something, I'm usually right.",
    life_outside_weekend:
      "I work something hands-on and practical — the kind of job where I've usually fixed a problem before anyone else even noticed it was there. I live alone. I have a cat who tolerates exactly one person, and it's me.",
    relationship_to_scooby:
      "I was on the outside of this group for a long time before I really felt like I belonged, and Scooby was the first one who made room for me. I've never forgotten that. I don't think I ever really will.",
    alibi:
      "I was in the kitchen with Shaggy for most of it, prepping the salads. I did step out to the garage around 5:30 for more ice, and I ended up staying out there a few minutes cutting fruit for Saturday since there wasn't any counter space left inside. When I came back in, Shaggy was still there. Scooby wasn't.",
    secret:
      "Back in July, I found Scooby crying in his car outside my apartment — he'd just gotten some test results back and he didn't know how to tell anyone. I sat with him for two hours that night. Since then I've been the one driving him to appointments when he needed a ride, keeping track of his medication schedule, covering for him when he needed to duck out of things without twenty questions. It's been exhausting, honestly, in a way I never expected. But it was never something Scooby forced on me — I offered. Whatever he decides to do with his own diagnosis, telling everyone or telling no one, that's entirely his call. I've never once tried to talk him out of anything he actually wanted.",
    motive:
      "The one thing I never agreed with was doing this on his timeline instead of mine. I'm the one who'd actually deal with the fallout at work if people found out how long I'd been quietly managing a friend's medical situation without saying anything to my own manager. I told Scooby more than once that I needed more say in how and when this came out. Friday, he told me flatly that he was done waiting on me. Dinner was happening tonight, whether I'd signed off on it or not.",
  },
  {
    name: "Velma Dinkley",
    gender: "female",
    bio: "I'm the one who actually read the rental agreement. I knew checkout was 11:00, not the 10:30 everyone else got told, I knew exactly where the fire extinguisher was, and I knew exactly how much everyone still owed. I spent most of Friday afternoon on the deck with a book, which is genuinely my favorite kind of party.",
    personality:
      "I read the fine print nobody else bothers with, and I remember it forever. I'm not antisocial, exactly — I just usually find a book more reliably interesting than most conversations, until the conversation turns into something I actually want to solve.",
    life_outside_weekend:
      "I work something research- or data-adjacent, and it makes me annoyingly good at group trivia. I read about a book a week, and I'll tell you unprompted whether it was worth it. I handle the group's check-splitting because nobody else will do it fairly.",
    relationship_to_scooby:
      "Scooby and I had this running bit where he'd pretend to understand whatever I was reading and I'd pretend to believe him. Underneath it, he was one of the only people who ever asked me follow-up questions and actually meant them.",
    alibi:
      "I was on the back deck from about 5:00 on, book in hand, a Hazy Little Thing next to me. I had a clear view of the driveway that whole time — I actually watched Fred head out to his car at one point, you can ask him what time that was, it should match what I'm telling you. I never left that spot.",
    secret:
      "Angel and I have secretly been together for months. Nobody in the group knows. Scooby knew, and Friday he didn't ask me gently about it — he told me plainly that if I didn't say something to the group by the end of dinner tonight, he'd make it obvious himself. A comment, a look, something. He wasn't cruel about it. He also wasn't kidding.",
    motive:
      "Scooby had found out about something private in my life — a relationship I've been keeping to myself — and Friday he told me he thought I should stop hiding it, that he might even nudge it into the open himself at dinner if I didn't. It could read as a threat if you didn't know him. Honestly it didn't quite feel like one to me. It felt like Scooby being insufferably certain he knew what was best for me — which, to be fair, is basically always how he operated.",
  },
  {
    name: "Emile Mondavarious",
    gender: "male",
    bio: "I put the whole cabin on my card, and I've probably mentioned the reservation number three separate times this weekend. I like to think I'm gracious, generous, and extremely comfortable being the guy everyone owes money to. I did not go on the hike.",
    personality:
      "I'm warm, maybe a little performative about it, and I genuinely enjoy taking care of things — right up until it gets expensive or physically demanding, at which point I tend to discover a phone call I need to take.",
    life_outside_weekend:
      "I'm older than most of this group, and I treat that like a personality trait. I work in something finance-flavored — ask me twice and you'll probably get two different answers. I own exactly one nice watch and I bring it up more than the watch would probably like.",
    relationship_to_scooby:
      "I liked Scooby the way a host likes a good guest — warmly, at a bit of a distance. He was actually the only one who ever asked me whether I was having a good time, instead of just assuming I was fine because I was the one paying for everything.",
    alibi:
      "I stayed at the cabin the whole time everyone was hiking — phone call on the porch until about five, then I started on the grill. Bronson saw me out there around 5:15 when he left for ice, and honestly, from that point on I was basically stationed at that grill in plain sight of the whole driveway as people started trickling back in from the hike.",
    secret:
      "I'm nowhere near as financially comfortable as this group assumes I am. I've put more on my card this trip than I can really absorb right now. Scooby figured it out somehow — saw something he shouldn't have — and Friday he told me, plainly, that he thought I should tell people myself before someone else noticed. He didn't say he'd do it for me. He also didn't say he'd stay quiet about it.",
    motive:
      "Scooby had figured out something about my finances that I've worked very hard to keep this group from seeing — that the image I project and the reality don't match. Friday, he told me dinner tonight was going to be a night for a few overdue conversations, and I understood exactly which one of mine he meant. It wasn't really a threat, not in so many words. It also didn't feel like a maybe.",
  },
];
