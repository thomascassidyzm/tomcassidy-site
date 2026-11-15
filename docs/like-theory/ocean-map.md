**DRAFT for Tom to edit.** A content relation, not a measurement.

# The moments against OCEAN: what each option shares ground with

## Read this first

This table lines up every option in the 30 moments with the public-domain IPIP items it **shares ground with**. It's a reading of the words: the option and the IPIP item describe the same kind of behaviour. It does **not** mean the option measures that facet. Nobody has checked that yet. A shared item is a prediction to test (see collection-design.md), not a claim.

**Source of the items.** The IPIP-NEO facet set: Goldberg's 30 facet scales built to match the NEO-PI-R, 10 items each (the "300"), of which Johnson's IPIP-NEO-120 keeps 4 per facet. Item text is quoted exactly from the IPIP key pages:
- 300-item facet key: https://ipip.ori.org/newNEOFacetsKey.htm
- 120-item key (Johnson 2014): https://ipip.ori.org/30FacetNEO-PI-RItems.htm

Items marked **+** are keyed towards the facet and items marked **–** are keyed away from it. Items in the 120 have ¹ after them. "Our weights" are the hand-set weights from `bank.json` on `origin/dev`.

**Fit**
- **close**: the option is a concrete case of the item.
- **partial**: it overlaps, but the option carries something the item doesn't, or the reverse.
- **weak**: the nearest item, and a stretch.
- **no counterpart**: nothing in the 30 facets fits, and it isn't forced.
- **⚠ sign**: the IPIP item would read this option the *opposite* way from our weight.

Facet codes: N1 Anxiety, N2 Anger, N3 Depression, N4 Self-consciousness, N5 Immoderation, N6 Vulnerability · E1 Friendliness, E2 Gregariousness, E3 Assertiveness, E4 Activity level, E5 Excitement-seeking, E6 Cheerfulness · O1 Imagination, O2 Artistic interests, O3 Emotionality, O4 Adventurousness, O5 Intellect, O6 Liberalism · A1 Trust, A2 Morality, A3 Altruism, A4 Cooperation, A5 Modesty, A6 Sympathy · C1 Self-efficacy, C2 Orderliness, C3 Dutifulness, C4 Achievement-striving, C5 Self-discipline, C6 Cautiousness.

Our N is labelled **Sensitivity**: "how loudly the alarm system runs". It is the Big Five's Neuroticism, the same direction up. Our R, **Risk appetite**, has no Big Five domain. See the last section.

---

## Section 1

### 1 · The party, host in the kitchen (E)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Tea towel, help the host | A .6, E .3, C .3 | A3 Altruism; N4 Self-consciousness | + "Anticipate the needs of others." + "Love to help others."¹ · N4 + "Find it difficult to approach others."¹ | partial. The "gives you a job" part is social unease, and N4 holds that better than E. |
| Introduce yourself cold | E 1, R .3 | E1 Friendliness; E2 Gregariousness; N4 | + "Warm up quickly to others." + "Talk to a lot of different people at parties."¹ · N4 – "Am comfortable in unfamiliar situations." | close |
| The one other person alone | E .2, A .5, O .2 | A3 Altruism | + "Make people feel welcome." | partial. The O weight has no counterpart. |
| Phone, quiet corner, early exit | E –1 | E2; E1 | – "Avoid crowds."¹ – "Prefer to be alone."¹ · E1 – "Keep others at a distance."¹ | close |

### 2 · The yoghurt four days past its date (R)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Eat it, the nose is the law | R .8, C –.2 | C6 Cautiousness, reversed | – "Like to act on a whim." | weak. A small health risk; no facet is about that. |
| Full tribunal, tiny taste | R .3, C .5 | C6 | + "Avoid mistakes." | partial |
| Bin it | R –.7, N .3 | C6; N1 Anxiety | + "Avoid mistakes." · N1 + "Fear for the worst."¹ | weak |
| Eat it, then monitor yourself | R .4, N .8 | N1 | + "Worry about things."¹ | close on the N part |

### 3 · Admin due in three days (C)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Do it now, coat still on | C 1, N .2 | C5 Self-discipline | + "Get chores done right away." + "Start tasks right away." | close |
| Calendar slot tomorrow | C .6, N –.2 | C2 Orderliness | + "Do things according to a plan." | close |
| Day three, ten minutes to spare | C –.5, R .3, N –.4 | C6 reversed; C5 reversed; N1 reversed | – "Often make last-minute plans." · C5 – "Need a push to get started." · N1 – "Am not easily bothered by things." | partial. The R weight has no counterpart. |
| Joins the pile you don't look at | C –1, N .5 | C5 reversed; N6 Vulnerability | – "Have difficulty starting tasks."¹ – "Find it difficult to get down to work." · N6 + "Become overwhelmed by events."¹ | close on C, weak on N |

### 4 · The restaurant you dislike (A)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Go along, say nothing | A .9, E –.3 | A4 Cooperation; E3 Assertiveness, reversed | + "Can't stand confrontations." + "Am easy to satisfy." · E3 – "Hold back my opinions." | close |
| Say you're not keen, pitch another, cheerfully | A –.5, E .7 | E3 | + "Seek to influence others." + "Can talk others into doing things." | partial. IPIP's low A is "Contradict others" or "Have a sharp tongue". A cheerful pitch is assertive, not disagreeable. |
| Suggest the group splits | A –.3, O .6, R .3 | none | none | no counterpart. Neither the O nor the R weight finds a facet. |
| Go along, "next pick is mine" | A .5, E .3, C .2 | A4; N4 reversed | + "Am easy to satisfy." · N4 – "Am able to stand up for myself." | partial |

### 5 · The friend who wants to pop in (N)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| "Door's open!", dishes stay | N –.8, E .5 | N4 reversed; E1 | – "Am not embarrassed easily." · E1 + "Feel comfortable around people."¹ | close |
| Eighteen minutes of cleaning | N .6, E .3 | N4; C2 Orderliness | + "Am afraid that I will do the wrong thing." · C2 + "Want everything to be 'just right.'" | partial. IPIP would also hear C2 here, and we give no C weight. |
| "Café on the corner?" | N .7, A .3, C –.2 | N4 | + "Am afraid to draw attention to myself."¹ | weak |
| Postpone until presentable | N .5, E –.5 | N4; E2 reversed | + "Only feel comfortable with friends."¹ · E2 – "Want to be left alone." | partial |

### 6 · A free evening, energy for one thing (O)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| The series you know and love | O –.8 | O4 Adventurousness, reversed | – "Prefer to stick with things that I know."¹ – "Am a creature of habit." | close |
| The strange documentary | O .9 | O4; O5 Intellect | + "Am interested in many things." · O5 + "Enjoy thinking about things." | close |
| Learn something with no payoff | O 1, C .3 | O5; O4 | + "Love to read challenging material."¹ · O4 + "Like to begin new things." | close |
| Clear the nagging admin | C .9, O –.3 | C5 | + "Get chores done right away." | close |

### 7 · Recharging after a brutal week (E)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Cave weekend | E –1 | E2 reversed | – "Want to be left alone." – "Seek quiet." | close |
| Get people round | E 1 | E2 | + "Enjoy being part of a group." + "Involve others in what I am doing." | close |
| One close friend, one long walk | E .1, A .5 | none clean | nearest N4 + "Only feel comfortable with friends."¹ | weak. Closeness to one friend isn't in IPIP's A. The A weight drifts off its facets. |
| Somewhere loud, nobody knows you | E .6, O .3 | E5 Excitement-seeking | + "Enjoy being part of a loud crowd." + "Love excitement."¹ | close |

### 8 · The 6:30 alarm in November (C)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Up on the first note | C 1, N –.2 | C5 | + "Carry out my plans."¹ + "Get to work at once." | close |
| The designed snooze | C .5 | C2 | + "Do things according to a plan." | partial |
| Renegotiate from the duvet | C –.5, N .3 | C5 reversed; N5 Immoderation | – "Need a push to get started." · N5 – "Easily resist temptations."¹ | partial. The duvet is a temptation, and N5 is the facet for that. |
| Alarm has migrated to 7:15 | C –.7, N –.2 | C5 reversed; C3 Dutifulness, reversed | – "Carry out my plans."¹ · C3 – "Break my promises."¹ | partial |

### 9 · Splitting the bill six ways (A)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Split it | A .8 | A4 | + "Am easy to satisfy." + "Hate to seem pushy." | close |
| "I'll put in for what I had" | A –.6, C .4 | none clean | nearest N4 – "Am able to stand up for myself." | weak. IPIP's low A is hostility, and paying your own share isn't hostile. This is Tom's "saying the plain thing", which IPIP has no item for. |
| Split now, itemise as a policy | A .4, C .5, N .3 | C2 | + "Love order and regularity." | partial |
| Split, then eat less at the next three | A .5, N .6, C .3 | A4 reversed | – "Hold a grudge." | weak, **⚠ sign**. IPIP would read covert ledger-keeping as *lower* A, and we weight it +.5. |

### 10 · The 11pm rabbit hole (O)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Follow it down | O 1, C –.4 | O5; O1 Imagination; C5 reversed | + "Enjoy thinking about things." · O1 + "Like to get lost in thought."¹ · C5 – "Waste my time."¹ | close |
| Bookmark, return at the weekend | O .6, C .7 | O5; C5 | + "Enjoy thinking about things." · C5 + "Carry out my plans."¹ | partial |
| Bookmark, knowing it ends there | O .2, C .3, N .2 | none clean | none | no counterpart. Self-knowing resignation isn't in any facet. |
| Close the tabs, it was the hour | O –.6, C .3, N –.2 | O5 reversed | – "Avoid difficult reading material." | weak |

## Section 2

### 11 · Twenty-four hours of silence (N)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Reread it twice, hunting | N 1 | N1; N4 | + "Worry about things."¹ + "Get caught up in my problems." · N4 + "Am afraid that I will do the wrong thing." | close |
| Forget it until they reply | N –1 | N1 reversed | – "Am not easily bothered by things." – "Don't worry about things that have already happened." | close |
| Light nudge, move on | N .1, E .5, R .3 | E3 | + "Take charge."¹ | weak. The R weight has no counterpart. |
| Decide it's a no, brace now | N .6, R –.3 | N1 | + "Fear for the worst."¹ | close |

### 12 · The Singing Caves, 9 miles (O)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Turn off | O 1, R .3, C –.3 | O4; E5; C6 reversed | + "Like to visit new places." · E5 + "Seek adventure."¹ · C6 – "Like to act on a whim." | close |
| Look them up, maybe on the way back | O .3, C .7 | C2 | + "Do things according to a plan." | partial |
| Feel the pull, keep driving | O –.2, C .6, N .2 | C6 | + "Stick to my chosen path." | close on C |
| Nine miles each way? Drive on | O –.8, N –.3 | O4 reversed | – "Prefer to stick with things that I know."¹ | partial |

### 13 · The wobbly kitchen chair (R)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Chair, now, tiptoes | R .9 | C6 reversed; E5 | – "Rush into things."¹ · E5 + "Enjoy being reckless."¹ | partial |
| Excavate the ladder | R –.7, C .5 | C6 | + "Avoid mistakes." | partial |
| Chair, but managed | R .3, C .6 | C6 | + "Avoid mistakes." | partial |
| Leave it dark for now | R –.2, C –.5 | C5 reversed | – "Postpone decisions." – "Need a push to get started." | partial |

### 14 · Undercharged £40 (A)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Walk back and pay | A .8, C .6 | A2 Morality; C3 Dutifulness | + "Would never cheat on my taxes." · C3 + "Tell the truth."¹ + "Listen to my conscience." | close. It's also HEXACO Honesty-Humility territory. |
| Pay next time, if you remember | A .3, C –.4 | C3 | + "Pay my bills on time." | weak |
| Keep it, it evens out | A –.6, R .2 | A2 reversed | – "Know how to get around the rules." | partial |
| Keep it, tip extra later | A .4, N .4, C .3 | none clean | none | no counterpart |

### 15 · The drawer that needs a shove (C)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Toolbox out now | C .8, E .2 | C5 | + "Start tasks right away." | close. The E weight has no counterpart. |
| Add it to the real list | C .7, N –.2 | C2 | + "Do things according to a plan." | close |
| Shove and prayer, the system now | C –.8, N –.3 | C2 reversed | – "Am not bothered by disorder." | close |
| Watch a fix-it video, buy nothing | C –.4, O .4, N .3 | C5 reversed | – "Find it difficult to get down to work." | partial. The O weight has no counterpart. |

### 16 · The chatty stranger on the train (E)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Put the book away | E .9, O .4, A .3 | E1; E2 | + "Warm up quickly to others." · E2 + "Talk to a lot of different people at parties."¹ | close |
| Ten minutes, then the book | E .2, A –.2, C .4 | N4 reversed | – "Am able to stand up for myself." | weak |
| Briefer and briefer | E –.6, A .3, N .3 | E1 reversed; A4 | – "Keep others at a distance."¹ · A4 + "Hate to seem pushy." | partial |
| Headphones at the first pause | E –.9, A –.3 | E2 reversed | – "Want to be left alone." | close |

### 17 · Results on Friday, it's Monday (N)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Fill the week so full | N .6, C .6, E .3 | E4 Activity level | + "Am always busy."¹ | partial. It's a coping style, and no facet holds that as such. |
| Notice it, breathe, it passes | N –.6 | N6 reversed | – "Know how to cope." – "Remain calm under pressure."¹ | close |
| Low-grade static all week | N 1 | N1; N2 Anger | + "Get stressed out easily."¹ · N2 + "Get irritated easily."¹ | close. "Fuse shorter" is N2. |
| Pre-live the likely outcome | N .7, C .4, R –.2 | N1 | + "Fear for the worst."¹ | close |

### 18 · The thing you always wondered about (O)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| "Wait, go back" | O 1, E .5 | O5 | + "Enjoy thinking about things." | close on O. The E part is nearest E3 "Take charge.", weak. |
| Catch them later, one to one | O .7, E –.3 | O5; E3 reversed | + "Enjoy thinking about things." · E3 – "Don't like to draw attention to myself." | partial |
| Note it, actually look it up | O .5, C .5 | O5; C5 | + "Like to solve complex problems." · C5 + "Carry out my plans."¹ | partial |
| Let it drift past | O –.8 | O5 reversed | – "Am not interested in abstract ideas." | partial |

### 19 · Cutting it fine (R)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Leave over an hour before | R –.8, C .4, N .3 | C6; N1 | + "Avoid mistakes." · N1 + "Fear for the worst."¹ | partial |
| Fifty minutes, one cushion | R –.2, C .5 | C2 | + "Do things according to a plan." | partial |
| Forty, exactly on time | R .6 | C6 reversed | – "Often make last-minute plans." | weak |
| Thirty-five, the edge is half the point | R 1, C –.3 | E5; C6 reversed | + "Love excitement."¹ · C6 – "Rush into things."¹ | partial |

### 20 · Tears across the aisle (A)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Lean over: anything I can do? | A .8, E .4, R .4 | A3; A6 Sympathy | + "Anticipate the needs of others." · A6 + "Suffer from others' sorrows." | close |
| Tissues, a nod, no talk | A .6, E –.2 | A3 | + "Am concerned about others."¹ | close |
| Leave them their privacy | A –.1, N –.2 | none | none. A3 – "Turn my back on others." would misread it. | no counterpart. The option is framed as a kindness. |
| Feel it hard, do nothing, carry it home | A .3, N .8, E –.4 | O3 Emotionality; A6 | + "Feel others' emotions."¹ · A6 + "Suffer from others' sorrows." | partial. IPIP files this under **Openness** (O3), and we weight it N. |

## Section 3

### 21 · £180 lighter than it should be (C)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Statement open, line by line | C .9, N .4 | C2 | + "Want everything to be 'just right.'" | close on C |
| Two-minute scan, let it go | C .3, N –.3 | none clean | none | weak |
| Shrug, months vary | C –.7, N –.5, R .2 | C2 reversed; N1 reversed | – "Am not bothered by disorder." · N1 – "Am not easily bothered by things." | partial |
| A pulse of worry, never check | C –.5, N .8 | N1; C5 reversed | + "Worry about things."¹ · C5 – "Postpone decisions." | close |

### 22 · A second invitation, Sunday (E)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Go | E 1 | E2; E4 | + "Enjoy being part of a group." · E4 + "Do a lot in my spare time."¹ | close |
| Decline, honestly | E –.7, A –.2 | E2 reversed | – "Seek quiet." | close on E. The A weight has no counterpart. |
| A softer excuse, "family stuff" | E –.6, A .4, N .3 | E2 reversed; C3 reversed | – "Want to be left alone." · C3 – "Misrepresent the facts." | partial, **⚠ sign** on A. IPIP reads a white lie as *lower* on C3 and A2, and we weight it A +.4. |
| Say maybe, decide on the day | E –.1, C –.6 | C6 reversed; C5 reversed | – "Often make last-minute plans." · C5 – "Postpone decisions." | close |

### 23 · A small odd symptom, a week now (N)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Book the GP today | N .2, C .8 | C5 | + "Start tasks right away." | partial |
| Give it another week | N –.7 | N1 reversed | – "Am not easily bothered by things." | partial |
| Search it, forty minutes, three conditions deep | N 1 | N1; N6 | + "Worry about things."¹ + "Get caught up in my problems." · N6 + "Become overwhelmed by events."¹ | close |
| Tell no one, think about it a lot | N .8, E –.4 | N1 | + "Worry about things."¹ | close on N. The E weight has no counterpart. |

### 24 · An opinion dismantled (O)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| "Go on, break the rest of it" | O 1, N –.4 | O5 | + "Enjoy thinking about things." + "Like to solve complex problems." | close |
| Defend hard, re-examine tomorrow | O .5, N .4, E .3 | A4 reversed | – "Contradict others." | weak |
| Concede points, keep the conclusion | O –.4 | O4 reversed | – "Am attached to conventional ways."¹ | weak |
| Steer somewhere lighter | O –.6, A .5, E –.2 | O5 reversed; A4 | – "Avoid philosophical discussions."¹ · A4 + "Can't stand confrontations." | close |

### 25 · Through the party wall (R)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Knock with a pretext | R .7, A .6, E .4 | A3; N4 reversed | + "Am concerned about others."¹ · N4 – "Am not bothered by difficult social situations."¹ | partial. The social risk itself has no counterpart. |
| Listen hard, then decide | C .7, N .4, R –.2 | C6 | + "Avoid mistakes." | partial |
| Not your wall's business | R –.5, N .3, A –.2 | A3 reversed | – "Turn my back on others." | weak |
| Log it, set a threshold | C .8, R –.3, N .3 | C2 | + "Do things according to a plan." | close on C |

### 26 · The friend quitting to day-trade (A)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Say plainly it's a mistake | A –.8, C .4 | A4 reversed; C3 | – "Contradict others." · C3 + "Tell the truth."¹ | partial. IPIP reads candour as low A. HEXACO would read it as high honesty. It's Tom's "saying the plain thing". |
| Ask the hard questions | O .5, C .7, A –.2 | O5; C6 | + "Like to solve complex problems." · C6 + "Avoid mistakes." | partial |
| Cheer them on | A .8, R .3 | A4; A1 Trust | + "Can't stand confrontations." · A1 + "Believe that others have good intentions."¹ | partial |
| Mild, hedged concern | A .5, N .5 | A4 | + "Hate to seem pushy." | partial |

### 27 · The resolution, flat for eleven days (C)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Restart tonight | C .8, N –.2 | C5; N6 reversed | + "Carry out my plans."¹ · N6 – "Readily overcome setbacks." | close |
| Retire it on purpose | O .5, C .2, N –.3 | O3 | + "Enjoy examining myself and my life." | partial |
| Let it fade | C –.7, N .2 | C3 reversed; C5 reversed | – "Break my promises."¹ · C5 – "Postpone decisions." | partial |
| Rebuild it at a third of the size | C .6, O .3 | C4 Achievement-striving; C1 Self-efficacy | + "Turn plans into actions." · C1 + "Come up with good solutions." | partial |

### 28 · "Say a few words!" (E)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Stand up, enjoy it | E 1, N –.4 | A5 Modesty, reversed; N4 reversed | – "Make myself the center of attention." · N4 – "Am not embarrassed easily." | close. IPIP files "center of attention" under A5, and we carry no A weight. |
| Short and warm, sit down fast | E .1, A .4, N .3 | A3 | + "Have a good word for everyone." | partial |
| Deflect with a joke and a toast | E –.3, N .4 | N4; E6 Cheerfulness | + "Am afraid to draw attention to myself."¹ · E6 + "Amuse my friends." | partial, **⚠ sign** on E. E6 would read the joke as *more* E. |
| Point at someone else | E –.8, N .6 | N4; E3 reversed | + "Am afraid to draw attention to myself."¹ · E3 – "Keep in the background." | close |

### 29 · Your friend got the thing you wanted (N)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Celebrate hard, ache and all | N .2, A .6, C .4 | A3 | + "Am concerned about others."¹ | partial |
| Perform it, leave early, rough company | N .7, A .4, E –.3 | N2 | + "Am often in a bad mood." | partial |
| Tell them the whole truth | N .4, R .5, E .3, A .3 | O3 | + "Experience my emotions intensely."¹ | partial. Envy itself has no IPIP facet, and the R weight has no counterpart. |
| Ration the friendship | N .5, E –.4, A –.2 | A3 reversed | – "Turn my back on others." | weak |

### 30 · The partner, hand in hand (R)
| Option | Our weights | Shares ground with | IPIP item(s) | Fit |
|---|---|---|---|---|
| Tell your friend today, stay | R .8, C .4, E .3 | C3; E3 | + "Tell the truth."¹ · E3 + "Take charge."¹ | partial. The risk of being wrong has no counterpart. |
| Go to the partner first | R .6, E .5, C .4, A –.3 | E3; A2 reversed | + "Take control of things."¹ · A2 – "Put people under pressure." | partial |
| Verify before igniting | C .8, R –.3, N .4 | C6 | + "Avoid mistakes." · – "Jump into things without thinking."¹ | close |
| Hold it | R –.7, N .6, A .4 | A4; N1 | + "Can't stand confrontations." · N1 + "Fear for the worst."¹ | partial |

---

## The honest exit

The bank says every moment carries a fifth answer, the honest exit: "none of these / it depends". It scores nothing. On tomcassidy.co the card no longer shows it. Links made earlier can still carry it, and it decodes to "not answered". "None of the rest are like me" does part of the same job: you name what *is* like you and leave the rest tied. IPIP has no counterpart to either. Its nearest is the neutral middle of a Likert scale, which is a rating, not a refusal.

## How the six leans sit against the five

| Our lean | Tom's words, lo → hi | Where it shares most ground | What it misses or adds |
|---|---|---|---|
| **O** Openness | the familiar → the unfamiliar | O4 Adventurousness and O5 Intellect, strongly | Nothing on O1 Imagination beyond one item, nothing on O2 Artistic interests, nothing on O6 Liberalism. Ours is curiosity and novelty, not aesthetics or politics. |
| **C** Conscientiousness | going with the flow → following through | C5 Self-discipline, C2 Orderliness, C6 Cautiousness | The best-covered lean: 25 moments touch it. Little on C1 Self-efficacy or C4 Achievement-striving. Ours is follow-through, not ambition. |
| **E** Extraversion | recharging alone → recharging with people | E2 Gregariousness and E1 Friendliness | Little on E3 Assertiveness, E4 Activity or E6 Cheerfulness. Ours is about where the energy comes from, which is the narrower, social half of E. |
| **A** Agreeableness | saying the plain thing → keeping the peace | A4 Cooperation, A3 Altruism, A2 Morality | The biggest framing difference. IPIP's low pole is hostility: "Insult people", "Yell at people". Ours is candour, "saying the plain thing", which IPIP doesn't hold as low A and HEXACO would score as *honesty*. Expect our A to correlate only moderately with IPIP A, and to have its own meaning. Two ⚠ sign items. |
| **N** Sensitivity | a quiet alarm → a loud alarm | N1 Anxiety and N4 Self-consciousness, strongly | Barely touches N2 Anger, N3 Depression or N5 Immoderation. Ours is the worry-and-exposure half of Neuroticism. One option, the train tears, is filed under Openness (O3) by IPIP. |
| **R** Risk appetite | protecting the downside → chasing the uncertain | Partly C6 Cautiousness, reversed, and partly E5 Excitement-seeking | **Not a Big Five domain, and no single facet holds it.** Its five moments span a health risk (yoghurt, chair), a time risk (cutting it fine) and a social or moral risk (the wall, the partner). Risk research treats these as different domains, measured separately, for example the DOSPERT scale (see the October study /d/bb57af4a). IPIP's wider pool may hold risk scales outside the NEO set; I did not check them, so none are mapped here. R also appears as small side-weights on many non-R options (nudges, excuses, splits). Most of those have no counterpart. |

**What this says about a correlation study.** Expect the clearest match on C, E and N. Expect O to match on curiosity facets, and A to match only partly. R has no Big Five target, so its test is different: against C6 reversed and E5, or against a risk scale. The full list of side-weights that have no counterpart is long. That's fine for a mirror, and it's the first place to look if a lean's correlation comes out low.
