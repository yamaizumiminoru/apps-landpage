# Content basis — 2026-09-24

## Owner's brief

Create one LP in `yamaizumiminoru/apps-landpage` for Annotator-Connotator, Sprint Lab, Pronunciation Lab and Speaking Lab. Preserve these four concepts:

1. AI assistance from intermediate to advanced, especially pronunciation, Verb Frame and nuance where mistakes may still be intelligible.
2. Make knowledge usable.
3. Find and train the learner's own ノビシロ.
4. Practice with personally interesting subject matter.

## Source snapshots inspected

These are internal maintenance references, not links shipped as public CTAs.

- **Annotator-Connotator**: `README.md`, blob `71584e11e04c000f0a70a53e1f01734f624b1bab`; `RELEASE_NOTES.ja.md`, blob `ea821d48e756a69c357a95895a83048ce0247103`, v0.8.12 dated 2026-09-24. Confirms annotation/connotation, public caption import, translation and re-analysis, audio, learning logs and exports.
  - https://github.com/yamaizumiminoru/Annotator-Connotator/blob/main/RELEASE_NOTES.ja.md
- **Sprint Lab**: `README.md`, blob `0ab48c78164bb70792ff33ec36521aaa704155f3`; `RELEASE_NOTES.md`, blob `a31619fa45be9522db688c1ecb61a422956f9c24`, 2026-09-24 development snapshot based on `cfb1b28`. Confirms the four courses, meaning/context-first retrieval, contrast/weak review and resume.
  - https://github.com/yamaizumiminoru/sprint-lab/blob/main/RELEASE_NOTES.md
- **Pronunciation Lab**: `docs/releases/v0.4.29.md`, blob `d86c69193aa2057b43f00f646682c40ec6432168`, 2026-09-24 research preview, implementation snapshot `a03611d2`. Used instead of treating every normative README/specification item as implemented. Confirms evidence-first discovery, blind confirmation, varied practice, audio feedback, later attention-off checks, legitimate variation, and English-first scope.
  - https://github.com/yamaizumiminoru/pronunciation-lab/blob/main/docs/releases/v0.4.29.md
- **Speaking Lab**: `README.md`, blob `161c2a83acec823be499ce03a41ba9d1ee48988a`. Confirms learner-led conversation, `?` notes, verified Review, learner-approved Nobishiro DB, Take 2, selective Anki export and user materials. Deployment is not provisioned automatically; real-provider validation remains necessary.
  - https://github.com/yamaizumiminoru/Speaking_Lab/blob/main/README.md
- **Existing public introduction**: repository `yamaizumiminoru/Annotator-Connotator-LP` is public with Pages enabled. Its deployed introductory page is the external CTA, not the private app repository.
  - https://yamaizumiminoru.github.io/Annotator-Connotator-LP/

## Deliberate boundaries

- No invented shared login, shared database, seamless automatic handoff, subscription plan, learning-outcome guarantee or proficiency score.
- Speaking Lab's longitudinal grouped referrals are not advertised as completed auto-integration.
- Pronunciation improvements are design goals and app milestones, not validated instrumental phonetic measurement or externally certified proficiency.
- Target-language scope varies; English-first apps are not advertised as equally multilingual.
- All product visuals are original explanatory HTML/CSS illustrations, explicitly labelled. They are not screenshots, genuine learner records or live model output.
- The demo is a predetermined `suggest + -ing` example, not a sentence-level correctness detector. It does not suggest that `suggest` has no other frames.
- Interesting subject matter is a learning-entry principle, not a promise that every Sprint question is generated from arbitrary uploaded material.
- No institutional affiliation, endorsements or customer numbers are invented.
- Source repositories stay private. Only a deployment of the LP's allowlisted static files is contemplated.
