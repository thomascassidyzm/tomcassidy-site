import type { Program } from '@/kit/types';

/**
 * Conquering Life — by Edward Orman & Tom Cassidy. The first programme to
 * carry the FAST framework: every focus point is a complete standalone
 * teaching in four movements — Focus, Approach, Story, Tool — built so things
 * happen FAST and stick FAST (the FAST of steadFAST).
 *
 * Shape: three domains (SELF / PERCEPTION / RESPONSE) of four weeks each, run
 * SEQUENTIALLY 1–12, with INTEGRATION as the thirteenth week — an in-rotation
 * hub that closes the loop. The teaching stays the same across all four
 * cycles; what deepens is the practice (see cycleDepths).
 *
 * The FAST text is the authors', verbatim. Edward's client stories are
 * carried as outlines (draft: true) awaiting his telling. The short
 * coach.wisdom lines are DRAFT distillations for the wheel's coach panel —
 * for the authors to finesse.
 */
export const conqueringLife: Program = {
  slug: 'conquering-life',
  title: 'Conquering Life',
  byline: 'Edward Orman & Tom Cassidy',
  blurb:
    'Twelve psychological skills and one integration — living consciously instead of on autopilot, one focus a week, four laps a year.',
  essaySlug: undefined,
  cycles: 4,
  // Weeks run straight through each domain (1-4 SELF, 5-8 PERCEPTION,
  // 9-12 RESPONSE, 13 Integration) — not the interleaved Franklin rotation.
  rotationStyle: 'sequential',
  cycleDepths: [
    { name: 'Awareness', instruction: 'Notice when this happens.' },
    { name: 'Minimum Action', instruction: 'Try doing it once this week.' },
    { name: 'Intentional Practice', instruction: 'Practice this daily.' },
    { name: 'Integration', instruction: 'This is just who you are now.' },
  ],
  metaQuestions: [
    { question: 'What would you choose?', gloss: 'Reason — thinking properly.' },
    { question: 'What are you putting in?', gloss: 'Reasonable — taking action.' },
  ],
  hub: {
    label: ['INTEGRATION'],
    algorithmName: 'Integration',
    numeral: '13',
    kicker: 'Week 13 · seeing the whole ocean',
    pigment: 'contested',
    inRotation: true,
    coach: {
      wisdom:
        'Twelve skills, one practice: living consciously instead of on autopilot. They aren’t sequential — they’re circular, and each one makes the others stronger.',
    },
    fast: {
      focus: [
        'Well, you know how you’ve been learning individual psychological skills - Self-Acceptance, The Pause Button, Perspective Choice - and each one is valuable on its own?',
        'Now it’s time to see how they all work together.',
        'Integration Week is recognizing that these aren’t 12 separate tools - they’re 12 facets of the same thing: living consciously instead of running on autopilot.',
      ],
      approach: [
        'Here’s the psychology: You’ve been pearl diving in 12 different locations. Each dive found pearls. But now step back and see the whole ocean.',
        'The thinking behind it is all 12 skills support each other:',
        'Self-Acceptance gives you the foundation to practice everything else without harsh self-judgment. The Pause Button creates space to apply every other skill. Belief vs. Fact helps you question the thoughts driving your patterns. Pattern Interruption lets you actually change what you’ve become aware of. Boundary Awareness protects the internal work you’re doing.',
        'They’re not sequential. They’re circular. You use Self-Talk Awareness to catch harsh thoughts, The Question Tool to ask what you’d choose, Emotional Labeling to create space from feelings, Internal Responsibility to own your part, and Perspective Choice to see it differently.',
        'The meta-questions apply to everything: What would you choose? (Reason - thinking properly). What are you putting in? (Reasonable - taking action).',
      ],
      story: [
        {
          voice: 'Edward',
          draft: true,
          text: [
            'Client’s breakthrough moment - they were triggered by criticism from their boss. In real-time they applied: The Pause Button (one breath), Belief vs. Fact (is “I’m incompetent” fact or belief?), Emotional Labeling (“This is shame”), Internal Responsibility (“What was my actual part?”), The Question Tool (“What would I choose to do?”). Five skills, one situation, 30 seconds. That’s integration. Not perfection - just conscious living.',
          ],
        },
        {
          voice: 'Tom',
          text: [
            'You’ve been building a psychological toolkit. Now you see how the tools work together. Each skill makes the others more powerful. The more you practice, the more automatic this becomes - until conscious living IS who you are.',
          ],
        },
      ],
      tool: {
        name: 'The Skills Map',
        practice: [
          'This week, practice The Skills Map.',
          'When something challenging happens, afterward map which skills you COULD have used:',
          'Situation: [describe what happened]',
          'Skills I could apply: Which Pause could I have taken? What Belief was I treating as Fact? Which Window was I looking through? What would I have Chosen consciously? Whose boundary was violated? What Pattern was I running?',
          'You’re not judging yourself. You’re building integration awareness. Seeing how the skills connect in real situations.',
          'Next cycle, you’ll catch these things IN the moment. For now, just map them afterward.',
        ],
      },
    },
  },
  domains: [
    {
      name: 'SELF',
      question: 'The foundation',
      pigment: 'established',
      focuses: [
        {
          week: 1,
          name: 'Self-Acceptance',
          lines: ['Self-', 'Acceptance'],
          coach: {
            wisdom:
              'See yourself clearly - strengths AND weaknesses - without the harsh judgment. You must be on your own side to change anything.',
          },
          fast: {
            focus: [
              'Well, you know how you notice every single flaw in yourself but dismiss every strength? How you can list 50 things wrong with you but struggle to name 3 things you do well?',
              'That’s distorted self-perception. And it’s running your life.',
              'Self-Acceptance is seeing yourself clearly - both strengths AND weaknesses - without the harsh judgment.',
            ],
            approach: [
              'Here’s the psychology behind it: Most people’s self-image was formed before age 4, before rational thinking even developed. You created a picture of yourself based on incomplete information, emotional experiences, and other people’s reactions. Then you spent your whole life looking for evidence that confirms this picture and dismissing evidence that contradicts it.',
              'The thinking behind it is that without self-acceptance, you can’t change anything. Because if you hate yourself, every attempt at change comes from “I’m broken and need fixing” rather than “I’m worthy and choosing growth.”',
              'Self-acceptance isn’t resignation. It’s the foundation. You can acknowledge flaws AND be on your own side. In fact, you MUST be on your own side to effectively change anything.',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client who achieved massive external success - promotion, weight loss, new relationship - but still felt empty because the internal voice remained critical. Nothing external could satisfy them because they fundamentally didn’t accept themselves. Only when they learned self-acceptance could they actually enjoy their achievements.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'And this connects directly to both meta-questions. What would you choose? Well, would you choose to have your harshest critic living in your head 24/7? And what are you putting in? If you’re constantly feeding yourself criticism, that’s what you’ll get out.',
                ],
              },
            ],
            tool: {
              name: 'The Child Test',
              practice: [
                'This week, practice the Child Test.',
                'Whenever you catch yourself with harsh self-talk - and you WILL catch it multiple times - imagine saying those exact words to a 5-year-old child. Any child. Would you say “You’re such an idiot for dropping the keys” to a child? No.',
                'So don’t say it to yourself.',
                'Replace it with what you WOULD say to a child: “It’s okay, everyone drops things sometimes.”',
                'That’s it. One week. Notice harsh self-talk. Run the Child Test. Replace with kindness.',
                'You’re learning to be on your own side.',
              ],
            },
          },
        },
        {
          week: 2,
          name: 'Self-Talk Awareness',
          lines: ['Self-Talk', 'Awareness'],
          coach: {
            wisdom:
              'There’s a voice in your head commenting on everything. It isn’t you - it’s programming. This week, just notice what it’s actually saying.',
          },
          fast: {
            focus: [
              'Well, you know how there’s a voice in your head that comments on everything? And you’ve been listening to it for so long you don’t even notice it’s there anymore? It’s like background music - constantly playing, rarely noticed.',
              'That voice is running your life.',
              'Self-Talk Awareness is becoming conscious of what that voice is actually saying, how it’s saying it, and what effect it has on you.',
            ],
            approach: [
              'Here’s the psychology: You produce approximately 50,000 thoughts per day. Research shows 70-90% of those thoughts are negative in the average person. That’s roughly 40,000 negative thoughts dominating your mind daily.',
              'The thinking behind it is that most self-talk is unconscious - automatic programs running in the background. These programs were installed in childhood, reinforced through repetition, and now run automatically. You’re not choosing these thoughts; they’re happening TO you.',
              'But here’s the key: automatic thinking can be retrained. First step? Notice it exists.',
              'The voice in your head is NOT you. It’s programming. And once you can see it as programming rather than truth, you can begin to question it.',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client who discovered their constant self-talk was actually their mother’s voice. Every criticism, every worry, every “should” - it was all language their mother used. They’d internalized it so completely they thought it was their own thinking. Once they saw this, they could separate themselves from it.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'What would you choose? If you could choose what voice speaks to you all day, would you choose this one? And what are you putting in? Every time you let that harsh voice run unchecked, you’re reinforcing the program.',
                ],
              },
            ],
            tool: {
              name: 'The Self-Talk Detective',
              practice: [
                'This week, become a self-talk detective.',
                'Carry a small notepad or use your phone. When you catch the voice saying something - anything - write down:',
                '1. What it said. 2. The tone (harsh? worried? critical? kind?). 3. How it made you feel.',
                'You don’t have to change anything yet. Just NOTICE. Most people are shocked when they see what they’re actually saying to themselves all day.',
                'Awareness precedes change. This week, just notice.',
              ],
            },
          },
        },
        {
          week: 3,
          name: 'Inherent Worth',
          lines: ['Inherent', 'Worth'],
          coach: {
            wisdom:
              'Your value isn’t earned by what you do - it exists because you exist. A baby doesn’t have to earn its worth; neither do you.',
          },
          fast: {
            focus: [
              'Well, you know how you feel like you have to earn your worth through achievement, productivity, or being useful to others? Like your value is conditional - “I’m worthwhile IF I’m successful, IF I’m thin, IF people like me, IF I accomplish something today”?',
              'That’s conditional worth. And it’s exhausting.',
              'Inherent Worth is understanding that your value isn’t earned through what you do - it exists because you exist.',
            ],
            approach: [
              'Here’s the psychology: Your worth is one of two fundamental components of your psychological foundation (along with locus of control). It’s the amount of value you believe you inherently have.',
              'The thinking behind it is that conditional worth - “I’m valuable IF…” - creates constant anxiety, people-pleasing, and the need to prove yourself. You’re never enough because there’s always another condition to meet. It’s a game you can’t win.',
              'Unconditional worth - “I’m valuable because I exist” - creates freedom. Not laziness or complacency, but freedom. Freedom to pursue goals because you WANT to, not because you NEED to prove your worth.',
              'Think about a baby. Does a baby need to earn their worth? No. They’re valuable simply because they exist. You were that baby once. What changed? Nothing fundamental about your worth - only your beliefs about it.',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client who was a high-achiever - successful career, athletic, accomplished - but utterly miserable because they believed their worth came from achievement. Every success brought temporary relief, then back to “What’s next?” When they failed or made a mistake, it felt like existential threat. Only when they separated being from doing could they actually enjoy their achievements AND handle setbacks without falling apart.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'What would you choose? Would you choose to tie your worth to things outside your control - other people’s opinions, market conditions, your productivity on a given day? And what are you putting in? If you’re consuming messages that say ‘you’re only valuable if…’, that’s what you’ll believe.',
                ],
              },
            ],
            tool: {
              name: 'Being vs. Doing',
              practice: [
                'This week, practice Being vs. Doing separation.',
                'Throughout your day, when you catch yourself measuring your worth by what you’ve accomplished, pause and ask:',
                '“Would a baby need to earn their worth?”',
                'The answer is always no. You’re as deserving as that baby. Nothing you do adds to or subtracts from your inherent worth.',
                'Actions have consequences. Behaviors can be good or bad. But YOU - your fundamental value as a human - is unconditional.',
                'Try this once a day. Separate being from doing.',
              ],
            },
          },
        },
        {
          week: 4,
          name: 'Internal Responsibility',
          lines: ['Internal', 'Responsibility'],
          coach: {
            wisdom:
              'Not blame - agency. Ask “what was my part?” and you find the one piece of any situation you can actually change.',
          },
          fast: {
            focus: [
              'Well, you know how sometimes you feel like life just happens TO you? Like you’re a passenger in a vehicle being driven by circumstances, other people’s decisions, bad luck, or forces outside your control?',
              'That’s external locus of control. And it makes you a victim.',
              'Internal Responsibility is recognizing where your power actually lies - not in controlling everything, but in owning your part in everything.',
            ],
            approach: [
              'Here’s the psychology: Locus of control refers to where you believe power lies - either within yourself (internal) or externally (in circumstances, other people, fate, luck).',
              'The thinking behind it is that external locus makes you powerless. If everything is outside your control, you’re at the mercy of the world. Internal locus makes you an actor. You can’t control everything, but you can control your responses, your choices, your part.',
              'This isn’t about blame. It’s about agency.',
              'When something goes wrong, you can ask “Why did this happen to me?” (external - victim) or “What was my part?” (internal - actor). The second question gives you power because if you had a part, you can change your part.',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Two clients who lost their jobs. One blamed the economy, the boss, unfair conditions - spent months bitter and stuck. The other asked “What was my part? What can I learn? What do I do next?” - was employed within weeks. Same external event, completely different outcomes based on locus of control.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'What would you choose? Would you choose to see yourself as powerless, or would you choose to see where your agency lies? And what are you putting in? If you’re consuming victim narratives all day - ‘nothing’s my fault, everything happens to me’ - you’re installing external locus.',
                ],
              },
            ],
            tool: {
              name: 'The Agency Question',
              practice: [
                'This week, practice The Agency Question.',
                'When something goes wrong - big or small - pause and ask:',
                '“What was my part?”',
                'Not to beat yourself up. Not to take ALL the blame. But to identify where your power lies.',
                'Traffic made you late → What was my part? (Left too late, didn’t check traffic.) Argument with partner → What was my part? (Tone, timing, reactivity.) Missed deadline → What was my part? (Planning, focus, saying yes to too much.)',
                'Find your part. That’s where your power to change things lives.',
              ],
            },
          },
        },
      ],
    },
    {
      name: 'PERCEPTION',
      question: 'The awareness',
      pigment: 'open',
      focuses: [
        {
          week: 5,
          name: 'The Pause Button',
          lines: ['The Pause', 'Button'],
          coach: {
            wisdom:
              'Between trigger and response there is a space. One conscious breath proves it exists - and in that space, you get to choose.',
          },
          fast: {
            focus: [
              'Well, you know how when you’re tired you snap at people more? Or you react to something and immediately regret it? Or you send that angry text and wish you could take it back?',
              'That’s your brain short-circuiting thinking to conserve energy.',
              'The Pause Button is discovering the space that exists between trigger and response - and learning to use it.',
            ],
            approach: [
              'Here’s the psychology: When your brain is low on resources (tired, stressed, overwhelmed), it conserves energy by skipping the thinking part and going straight from trigger to automatic response. It’s an efficiency mechanism - but it often produces regrettable results.',
              'The thinking behind it is there’s ALWAYS a space between stimulus and response. Always. Most people don’t know it exists. They experience: trigger → immediate reaction. But actually it’s: trigger → space → choice → response.',
              'That space is where your power lives. In that space, you can choose. Without it, you’re a robot responding to programming.',
              'Viktor Frankl said: “Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.”',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client who would explode at their kids when stressed from work. Felt terrible afterward, promised to change, then did it again. They believed they “couldn’t help it” - the anger just happened. Once they learned to find the pause - even one breath - they discovered they COULD choose. Not easy, but possible. That space changed everything.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'What would you choose? In that split second before you react, if you HAD a choice, what would you choose? And what are you putting in? If you’re running on empty - no sleep, no breaks, constant stress - you’re reducing your access to that pause space.',
                ],
              },
            ],
            tool: {
              name: 'The One Breath Pause',
              practice: [
                'This week, practice The One Breath Pause.',
                'When you feel triggered - annoyed, defensive, angry, anxious - before you respond, take ONE conscious breath.',
                'In through nose, out through mouth. That’s it.',
                'You’re not trying to calm down. You’re not trying to think positive thoughts. You’re just hitting pause for one breath to prove to yourself the space exists.',
                'Most people discover: “Oh, I DO have a choice. I’m not a robot.”',
                'One breath. Prove the space exists.',
              ],
            },
          },
        },
        {
          week: 6,
          name: 'Belief vs. Fact',
          lines: ['Belief', 'vs. Fact'],
          coach: {
            wisdom:
              '“I failed the test” is a fact. “I’m a failure” is a belief. Learn to tell them apart and beliefs lose their disguise.',
          },
          fast: {
            focus: [
              'Well, you know how you sometimes treat your thoughts as facts? Like “I’m not good enough” feels like THE truth, not just A thought? Or “They’re judging me” seems like reality, not assumption?',
              'That’s belief masquerading as fact. And it’s running your life.',
              'Belief vs. Fact is learning to distinguish between what you THINK and what’s actually TRUE.',
            ],
            approach: [
              'Here’s the psychology: Most of your beliefs were formed before age 4, way before rational thinking developed. You created beliefs based on emotional experiences, incomplete information, and limited perspective. Then you spent your whole life looking for confirming evidence and dismissing contradicting evidence.',
              'The thinking behind it is beliefs self-reinforce. If you believe “I’m unlikeable,” you’ll interpret neutral interactions as confirmation, dismiss positive interactions as flukes, and never test the belief by putting yourself out there.',
              'Beliefs feel like facts because they’ve been running unchallenged for so long. But they’re just thoughts that you’ve thought repeatedly. The more you think them, the more “true” they feel - not because they ARE true, but because neural pathways strengthen with use.',
              'Your brain doesn’t distinguish between fact and frequently-thought fiction.',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client who “knew” they were boring. This felt like fact. When asked “How do you know?” they said “People don’t want to talk to me.” When asked “What evidence?” they had… one memory from high school of being excluded. That’s it. One data point became a lifelong “fact.” Once they separated belief from fact and actually tested it, they discovered people DID enjoy talking to them.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'What would you choose? Would you choose to live according to beliefs you formed at age 3? And what are you putting in? Every time you accept a thought as fact without questioning it, you’re reinforcing that neural pathway.',
                ],
              },
            ],
            tool: {
              name: 'The Belief Audit',
              practice: [
                'This week, practice The Belief Audit.',
                'When a thought feels absolutely true - especially negative ones about yourself - pause and ask:',
                '“Is this FACT or BELIEF?”',
                'Fact = objectively verifiable, everyone would agree. Belief = your interpretation, others might see it differently.',
                '“I’m stupid” = Belief (others might disagree). “I failed the test” = Fact (verifiable). “I’ll never succeed” = Belief (unprovable prediction). “I didn’t get the job” = Fact (observable outcome).',
                'Just notice the difference. You don’t have to change the belief yet. Just see it AS a belief, not as reality.',
              ],
            },
          },
        },
        {
          week: 7,
          name: 'Perspective Choice',
          lines: ['Perspective', 'Choice'],
          coach: {
            wisdom:
              'Same rain, different window. Your lens creates your experience - and you can choose the lens.',
          },
          fast: {
            focus: [
              'Well, you know how the exact same rainy day can feel cozy and perfect when you’re inside reading a book, but feel depressing and miserable when you have to commute in it?',
              'Same rain. Different experience. Because of your perspective.',
              'Perspective Choice is recognizing that your lens determines your experience - and you can choose your lens.',
            ],
            approach: [
              'Here’s the psychology: Your brain doesn’t see reality itself - it sees through filters. Edward’s work identifies four primary “windows of perception”: external-negative, external-positive, internal-negative, internal-positive.',
              'The thinking behind it is most people believe their perspective IS reality. “That’s just how things are.” But actually, your perspective is just ONE way of seeing. It’s shaped by your experiences, beliefs, mood, energy level, and what you’ve been consuming.',
              'Same situation, different lens, completely different emotional experience.',
              'You’re not stuck with one lens. When you’re looking through a negative filter and everything looks terrible, you can recognize “I’m in the negative window right now” and actively choose to look through a different one.',
              'This isn’t toxic positivity. It’s recognizing that your emotional experience is created by your perspective, not by circumstances.',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client who described their life as “terrible” - stressed job, difficult relationship, health issues. But when asked to describe the same life from someone else’s perspective, they said “stable income, loving partner who sticks around through hard times, body that’s generally healthy despite challenges.” Same life. Different lens. Completely different emotional experience.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'What would you choose? Which window would you choose to look through? And what are you putting in? If you’re consuming negative news, doom-scrolling, surrounding yourself with complainers - you’re installing negative lenses.',
                ],
              },
            ],
            tool: {
              name: 'Window Awareness',
              practice: [
                'This week, practice Window Awareness.',
                'When you’re having a strong emotional reaction to something, pause and ask:',
                '“Which window am I looking through right now?”',
                'External-negative: “Everything out there is wrong/bad/threatening.” External-positive: “Look at all the good things happening around me.” Internal-negative: “I’m the problem/failure/not enough.” Internal-positive: “I’m capable/learning/growing.”',
                'Just name which window you’re in. Then ask: “Could I look through a different window right now?”',
                'You don’t have to force positivity. Just recognize you’re looking through A lens, not THE lens.',
              ],
            },
          },
        },
        {
          week: 8,
          name: 'The Input Principle',
          lines: ['The Input', 'Principle'],
          coach: {
            wisdom:
              'Life is a machine: you get out what you put in. You can’t feed it garbage and expect gold.',
          },
          fast: {
            focus: [
              'Well, you know how you expect to feel energized, positive, and motivated while consuming negative news, toxic social media, junk food, and no sleep?',
              'That’s magical thinking. Life doesn’t work that way.',
              'The Input Principle is understanding that life is a machine - you get out what you put in.',
            ],
            approach: [
              'Here’s the psychology: Your brain and body are processing machines. What you feed them determines what they produce. Input determines output. Always.',
              'The thinking behind it is most people focus on desired outputs (I want to feel better, have more energy, be more positive) while ignoring inputs (what they eat, consume, surround themselves with, practice daily).',
              'Tom’s philosophy from mathematics: If information is king, then implementation is God. Knowing you should exercise, eat well, consume positive content - that’s information. Actually DOING it - that’s implementation.',
              'You can’t hack the machine. You can’t put in garbage and expect gold. The sausage machine principle: what goes in one end comes out the other. Simple. Inevitable.',
            ],
            story: [
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'Teaching mathematics - students who wanted A’s but only put in C-level effort. They’d say “I want to understand calculus” but wouldn’t do practice problems. Want to change output? Change input. No magic. Just the machine.',
                ],
              },
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client who complained of depression while consuming 4+ hours of negative news daily, eating fast food, sleeping 4 hours, never moving their body. Changed inputs, depression lifted. Not because life got better, but because the machine had different fuel.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'What would you choose? If you could consciously choose your inputs, what would you choose? And what are you putting in? Right now, today - what’s actually going into the machine?',
                ],
              },
            ],
            tool: {
              name: 'Input Awareness',
              practice: [
                'This week, practice Input Awareness.',
                'Track three inputs for 3 days:',
                '1. Physical: What food/drink went in? Hours of sleep? 2. Mental: What content did you consume? (News, social media, books, conversations.) 3. Emotional: What energy were you around? (Positive people, complainers, alone time.)',
                'Don’t change anything yet. Just track. Most people are shocked when they see what they’re actually putting in versus what they expect to get out.',
                'You can’t change what you don’t measure.',
              ],
            },
          },
        },
      ],
    },
    {
      name: 'RESPONSE',
      question: 'The action',
      pigment: 'derived',
      focuses: [
        {
          week: 9,
          name: 'The Question Tool',
          lines: ['The Question', 'Tool'],
          coach: {
            wisdom:
              'Before the automatic response runs, ask: what would I choose? Not the script - you.',
          },
          fast: {
            focus: [
              'Well, you know how you react automatically to situations without realizing you had a choice? Like someone criticizes you and you immediately defend. Or you feel anxious and immediately reach for your phone. Or you’re bored and automatically open social media.',
              'That’s being chosen by your programming. You’re a passenger.',
              'The Question Tool is asking “What would I choose?” - separating your authentic self from your automatic scripts.',
            ],
            approach: [
              'Here’s the psychology: Most of your responses are automatic - programmed reactions running on neural pathways established years ago. You don’t CHOOSE to get defensive when criticized; it’s an automatic program running.',
              'The thinking behind it is when you’re on autopilot, you’re not YOU - you’re just playing out a script. The script was written by past experiences, childhood conditioning, repeated patterns. But it’s not who you authentically are.',
              '“What would I choose?” separates script from self. It creates a gap where you can ask: “Is this automatic response what I actually want? Or am I just running a program?”',
              'This is the meta-question that applies to everything. Every week’s focus, every situation, every response - you can always ask: “What would I choose?”',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client who automatically said “yes” to every request, then resented it. They thought they were being kind, but actually they were just running a people-pleasing script installed in childhood. When they started asking “What would I choose?” they discovered their authentic answer was often “no.” Not unkind, just authentic. The script said yes. THEY would have chosen no.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'This IS the meta-question. What would you choose? Not what does your programming choose, what does fear choose, what does your script choose - what would YOU choose? And what are you putting in? Every time you run the automatic script without questioning it, you’re strengthening that program.',
                ],
              },
            ],
            tool: {
              name: 'The Separation Question',
              practice: [
                'This week, practice The Separation Question.',
                'When you catch yourself about to react automatically - especially in situations you’ve been in a thousand times - pause and ask:',
                '“What would I choose?”',
                'Not what you usually do. Not what you “should” do. Not what’s easiest. What would you CHOOSE if you were actually choosing?',
                'Sometimes the answer is the same as the automatic response. Great - now it’s a choice, not a script.',
                'Sometimes the answer is different. That’s where your authentic self lives.',
              ],
            },
          },
        },
        {
          week: 10,
          name: 'Emotional Labeling',
          lines: ['Emotional', 'Labeling'],
          coach: {
            wisdom:
              '“This is anger” instead of “I am angry.” Name the feeling and you’re no longer inside it - you’re the one watching it.',
          },
          fast: {
            focus: [
              'Well, you know how sometimes an emotion hits and you become it completely? Anger sweeps you away and suddenly YOU ARE the anger. Anxiety floods you and YOU ARE anxious. Sadness drowns you and YOU ARE sad.',
              'That’s emotional fusion. You’ve merged with the feeling.',
              'Emotional Labeling is creating space between you and your emotions by naming them - “This is anger” instead of “I am angry.”',
            ],
            approach: [
              'Here’s the psychology: Your limbic system generates emotions faster than your prefrontal cortex can process them. Feelings arise automatically in response to triggers, and they’re designed to be fast - survival mechanism.',
              'The thinking behind it is emotions are information, not commands. They’re like weather - they arise, move through, and pass. But most people treat emotions as identity: “I AM angry” makes the emotion feel permanent and all-encompassing.',
              'Language matters. “I am angry” = fusion (you ARE the emotion). “I’m experiencing anger” = separation (the emotion is happening, but it’s not YOU).',
              'When you label an emotion - “This is anxiety” - you create observer distance. You’re not the anxiety; you’re the person noticing the anxiety. That shift changes everything.',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client with panic attacks who would say “I’m panicking, I’m losing control, I’m going crazy.” The fusion made it worse. When they learned to label - “This is panic. Panic is happening in my body right now.” - they created space. The panic still happened, but they weren’t swept away by it. They could observe it, which reduced its power.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'What would you choose? Would you choose to be your emotions, or would you choose to experience emotions? And what are you putting in? If you’re constantly in emotional reactivity with no space, you’re training fusion instead of observation.',
                ],
              },
            ],
            tool: {
              name: 'The Labeling Shift',
              practice: [
                'This week, practice The Labeling Shift.',
                'When you feel a strong emotion, pause and shift your language:',
                'Instead of: “I am angry/anxious/sad/frustrated.” Say: “I’m experiencing anger/anxiety/sadness/frustration” OR “This is anger/anxiety/sadness/frustration.”',
                'Even better: “Anger is present” or “I notice anxiety arising.”',
                'You’re not suppressing the emotion. You’re not positive-thinking it away. You’re just creating observer distance through language.',
                'You are not your emotions. You are the one experiencing them.',
              ],
            },
          },
        },
        {
          week: 11,
          name: 'Pattern Interruption',
          lines: ['Pattern', 'Interruption'],
          coach: {
            wisdom:
              'You can’t erase an old pathway, but you can build a new one. Interrupt the autopilot once and the new road begins.',
          },
          fast: {
            focus: [
              'Well, you know how you do the exact same thing in the same situation every single time, like a robot? Like you always say “yes” when you mean “no.” Or you always check your phone when anxious. Or you always eat when bored. Or you always get defensive when criticized.',
              'That’s a neural pathway - a mental highway your thoughts automatically travel down.',
              'Pattern Interruption is consciously doing something different than your autopilot response - creating new pathways.',
            ],
            approach: [
              'Here’s the psychology: Neural pathways are established through repetition. The more you do something, the wider the pathway becomes, until it’s a six-lane highway and you don’t even think - you just DO.',
              'The thinking behind it is these patterns were useful once. Maybe saying “yes” kept you safe as a child. Maybe checking your phone provided comfort when you were lonely. Maybe defensiveness protected you from harsh criticism. But now these patterns run automatically even when they’re not serving you.',
              'You can’t erase a neural pathway, but you can build a new one. Every time you interrupt the pattern and choose differently, you’re creating a new route. Do it enough times, and the new route becomes the highway.',
              'Neuroplasticity means your brain is changeable. You’re not stuck with your programming. But change requires conscious effort - you have to interrupt the automatic pattern.',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client who always responded to stress by working harder, sleeping less, pushing through. It was a pattern from childhood - “prove your worth through productivity.” Eventually led to burnout. Pattern interruption: when stressed, STOP and rest instead. Felt completely wrong at first (new pathway feels unnatural). But each time they did it, they strengthened the new pattern. Six months later, the new response became automatic.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'What would you choose? If you weren’t running on autopilot, what would you actually choose to do? And what are you putting in? Every time you run the automatic pattern without interrupting it, you’re paving that highway wider.',
                ],
              },
            ],
            tool: {
              name: 'The Pattern Break',
              practice: [
                'This week, practice The Pattern Break.',
                'Choose ONE automatic pattern you want to interrupt. Just one. When you catch yourself about to run the pattern, pause and do ANYTHING different.',
                'Always say yes → Try saying “Let me think about it.” Always check phone when anxious → Try taking three breaths instead. Always eat when bored → Try going for a 2-minute walk. Always get defensive → Try saying “Tell me more.”',
                'It doesn’t have to be perfect. It just has to be DIFFERENT than the automatic response.',
                'One pattern. One week. Interrupt it once. You’re building a new pathway.',
              ],
            },
          },
        },
        {
          week: 12,
          name: 'Boundary Awareness',
          lines: ['Boundary', 'Awareness'],
          coach: {
            wisdom:
              'Whose feeling is this? Whose problem? Know where you end and others begin - you can care without carrying.',
          },
          fast: {
            focus: [
              'Well, you know how you sometimes feel drained by people? Or you say “yes” when you mean “no”? Or you feel responsible for others’ emotions? Or you take on problems that aren’t yours to solve?',
              'That’s a boundary violation. You don’t know where you end and others begin.',
              'Boundary Awareness is recognizing and respecting the line between yourself and others - knowing what’s yours and what’s theirs.',
            ],
            approach: [
              'Here’s the psychology: Healthy boundaries are property lines - they define where you end and the other person begins. Without boundaries, you take on others’ emotions, problems, and responsibilities, leaving you depleted and resentful.',
              'The thinking behind it is boundaries aren’t walls - they’re not about shutting people out. They’re about clarity. Whose feeling is this? Whose problem is this? Whose responsibility is this?',
              'Many people were raised with poor boundary modeling. Maybe you were expected to manage a parent’s emotions. Maybe you were shamed for having needs. Maybe “good” meant putting everyone else first. So you never learned that you’re allowed to have boundaries.',
              'But boundaries aren’t selfish - they’re necessary. You can’t help anyone if you’re empty. You can’t have genuine relationships if you’re always performing. You can’t be yourself if you’re constantly taking on what belongs to others.',
            ],
            story: [
              {
                voice: 'Edward',
                draft: true,
                text: [
                  'Client who felt exhausted after every interaction with their mother. Took days to recover. They thought they were being loving by absorbing mom’s anxiety, solving mom’s problems, managing mom’s feelings. Actually, they were violating boundaries on both sides - taking on what wasn’t theirs, and preventing mom from handling her own life. When they established boundaries (“I hear you’re anxious, and I trust you can handle this”), the relationship improved. Less resentment, more genuine connection.',
                ],
              },
              {
                voice: 'Tom',
                text: [
                  'What would you choose? Would you choose to take on everyone else’s emotional weather? And what are you putting in? If you’re constantly absorbing others’ emotions without boundaries, you’re training yourself to be a sponge instead of a person.',
                ],
              },
            ],
            tool: {
              name: 'The Boundary Question',
              practice: [
                'This week, practice The Boundary Question.',
                'When you feel drained, resentful, or overwhelmed in interactions, pause and ask:',
                '“Whose feeling/problem/responsibility is this?”',
                'Theirs? Then you can care WITHOUT taking it on. “I hear you’re stressed, and I trust you’ll figure it out.” Yours? Then you can handle it WITHOUT blame. “This is my anxiety about your situation.” Shared? Then negotiate. “Let’s figure out who handles what.”',
                'Most boundary violations happen because no one asked this question. Just asking creates clarity.',
                'Where do you end? Where do they begin? Find the line.',
              ],
            },
          },
        },
      ],
    },
  ],
};
