# SEAL Lab Handbook (Skeleton v1)

*Secure and Ethical AI Research Lab · University of Colorado Boulder · Department of Information Science*

*Version 1.0 · Last updated: [DATE] · Maintained by: Jason Lucas*

---

## How to read this document

This handbook exists so that the norms that make SEAL work well are visible, explicit, and revisable — rather than tacit knowledge that new members have to guess at. Every section here is a norm the PI is currently committing to. If something in this document doesn't match how the lab actually operates, that's a bug: either the norm needs to change or the practice does, and either way it should be flagged.

Markers you'll see in this skeleton:

- **[DECIDE]** — the PI needs to choose between real options here; the current text is a placeholder.
- **[SEAL-SPECIFIC]** — this is a norm tied to something distinctive about SEAL's work (multilingual data, community collaborations, dialect-sensitive research), and shouldn't be generic-labbed.
- **[OPTIONAL]** — worth having eventually, not strictly needed on day one.

The handbook is a living document. Members can propose changes at any time; changes affecting the whole lab are discussed in group meeting.

---

## 1. Welcome and Mission

Welcome to SEAL. The Secure and Ethical AI Research Lab studies how language variation shapes both the harms and the defenses of modern AI systems. Our research is organized around four pillars — Multilingual NLP and Low-Resource AI; Trustworthy AI, Safety, and Information Integrity; Ethical and Equitable AI; and Human-Centered AI — with a signature focus on dialect-conditioned adversarial vulnerabilities in LLM safety guardrails and on evaluation infrastructure for underrepresented languages.

The lab exists to do research that would not be done, at the depth we think it deserves, if we did not do it. That framing should shape what problems we pick up and what problems we decline.

---

## 2. Lab Values and Culture

We commit to a small number of values that we think are load-bearing for the kind of work SEAL does. They are stated as norms, not aspirations.

**Research is a public good.** We publish, open-source, and share what we can. When we can't share something (community-owned data, in-review manuscripts, work under NDA), we say so and explain why. Secrecy is not the default; it's an exception that has to be justified.

**Rigor before novelty.** A boring result done carefully is more valuable than a novel result done sloppily. We test our own claims harder than any reviewer will, and we expect the same of each other. Failure to replicate our own numbers is a serious matter, not a routine one.

**Communities are collaborators, not data sources.** Much of our work touches communities whose languages and dialects have historically been extracted from without consent or benefit. Our default is engagement, not extraction. [SEAL-SPECIFIC] Section 12 makes this concrete.

**Care about each other.** We're a small lab; the wellbeing of every member is legible to the rest. Nobody is expected to work while sick, grieving, in crisis, or observing religious or cultural obligations. The lab is stronger when members are supported, and the PI would rather lose a paper deadline than lose a person.

**Failure is public.** Failed experiments, rejected papers, and abandoned projects are presented in group meeting alongside successes. This is not optional lab performance art; it's the mechanism by which the lab learns and by which new members learn that failure is normal.

**Disagreement is expected.** Disagreeing with the PI or with senior members is not just permitted — it's part of the job. Silence in the face of what you think is a bad idea is a failure of your responsibility to the lab.

---

## 3. Authorship and Credit

Authorship disputes are the single most common source of lasting damage in academic labs, and they almost always come from norms that were left implicit. This section is deliberately explicit.

**Default framework.** We use the [CRediT taxonomy](https://credit.niso.org/) for contribution documentation on every paper. Every author writes their own CRediT contributions before submission; the first author aggregates them into the paper.

**Order.** Our default is: first author is the person who did the most research work (typically a student or postdoc); the PI is last author; middle authors are ordered by contribution, with ties broken alphabetically. Equal-first-authorship is available and is used, not avoided.

**Adding and removing authors.** Authors are added to a project's Overleaf/GitHub *when they are first invited to contribute*, not the week before submission. If someone stops contributing partway, the authorship conversation happens explicitly — it is not left for the first author to worry about alone.

**Advisor role.** The PI's contribution is typically supervision, conceptualization, funding, and writing. This does not entitle the PI to first-author position on student work. If the PI ever becomes first author on a paper primarily driven by a student, that is an exceptional situation that has been explicitly discussed and agreed with the student.

**Disputes.** Authorship disagreements are raised with the PI as early as possible. If the PI is party to the dispute, disputes are raised with [DECIDE: Dept Chair / an agreed-on external mentor / an ombudsperson]. No paper is submitted with unresolved authorship questions.

**Acknowledgments.** We acknowledge contributions that don't rise to authorship — annotators, data providers, informal reviewers, community consultants. [SEAL-SPECIFIC] For community-sourced data, we discuss with community collaborators whether they want to be acknowledged, co-authored, or neither, and we honor that.

---

## 4. Communication Norms

**Primary channels.** Slack for lab-internal, day-to-day communication; email for external communication and anything that needs a formal record; GitHub/Overleaf for code and paper collaboration; [DECIDE: Notion / Coda / shared Google Drive] for lab-wide documents. Text messages are for logistics and emergencies only.

**Response expectations.** During normal working hours (roughly 9am–5pm Mountain, Mon–Fri), Slack replies within one working day are expected. Email replies within two working days. Outside those hours: no response expected, ever. If something is truly urgent, say so explicitly.

**Not online ≠ not working.** Nobody's productivity is measured by Slack presence, response speed, or hours visible on calendar. Deep work often looks like being offline. The PI's own working hours are irregular by necessity; do not treat late-night or weekend messages from the PI as an expectation to respond in kind. When in doubt, wait until Monday.

**Meetings vs. async.** Default is async. A meeting is called when: (a) a decision needs to be made and back-and-forth would be faster live, (b) a research idea needs collaborative thinking that doesn't work in writing, or (c) something is emotionally difficult and shouldn't be handled in text. Everything else — updates, questions, feedback on drafts — goes async first.

**PI availability.** The PI holds [DECIDE: N] office hours per week open to lab members without appointment, plus [DECIDE: weekly / biweekly] scheduled 1:1s with each direct advisee. For anything urgent outside those, Slack DM.

---

## 5. Meeting Structure

**Weekly group meeting.** [DECIDE: day and time] · 90 minutes · all lab members. Format alternates: one week is research updates (each member: 3 min on what they did, what's blocking them, what they want feedback on), the other is a reading or topic (one member presents a paper, dataset, or emerging topic). Once a month, one slot is a *failure post-mortem*: a failed experiment, a rejection, an abandoned line of work, presented by a volunteer.

**1:1s.** The PI meets weekly with every direct advisee, 30 minutes. The agenda is co-owned: the advisee brings the running list. Discussions cover current project state, blockers, career development, and anything else. Weekly frequency is the default for first-year PhD students; senior students can move to biweekly if it works better for them.

**Project meetings.** For any paper with more than two lab authors, a standing project meeting is set up: [DECIDE: weekly / biweekly], with clear ownership of agenda, notes, and action items. When the paper submits, the meeting either dissolves or converts explicitly into a new project.

**Admin check.** Once a month, the PI does a 30-minute admin sync with each advisee: paperwork, funding, deadlines, upcoming applications, milestones. Kept separate from research 1:1s so admin doesn't crowd out research thinking.

**Semester planning.** Every semester, each lab member writes a one-page plan: research goals, coursework, milestones, career development, personal constraints. Discussed with the PI in the first two weeks of the semester and revisited at the halfway point.

**Retreat.** [OPTIONAL] Once per semester, half-day off-campus lab retreat — research vision, big-picture direction, culture check-in. Rotating host.

---

## 6. Project Lifecycle

**Proposal.** Every project starts with a short (1–2 page) proposal doc: motivation, research question, why now, related work, proposed method, expected artifacts, risk of failure, kill criteria. Discussed with the PI before work begins. Nobody starts a serious project on speculation.

**Milestones.** Each project defines its own milestones at proposal time. At each milestone, the project team meets with the PI to review: are we on track? Have we learned something that changes the plan? Are the kill criteria met?

**Kill criteria.** Every project defines, at proposal time, the conditions under which we would abandon it. This is the single most important discipline in the project lifecycle. The default norm is: if kill criteria are met, the project is paused or ended, and the team writes a short internal retrospective. This is not a failure of the researcher; it is what the lab is supposed to do. **A member who kills a project when they should has done their job well.**

**Writing.** Papers are drafted in Overleaf. The first author owns the draft. The PI's default is: heavy feedback on structure and framing at the outline stage, moderate feedback on the full draft, lighter feedback on the final polish. Aim for the PI to see a full draft at least three weeks before the submission deadline. Later drafts get proportionally less feedback.

**Submission.** No paper is submitted without: PI signoff, complete author list with resolved order, all authors having read the final version, code and data plan agreed, artifacts prepared for release if applicable.

**Post-submission.** Every submitted paper gets a one-page internal writeup: what we did, what worked, what didn't, what we'd do differently. Filed in the lab knowledge base for future members.

---

## 7. Onboarding (First 90 Days)

Every new lab member — PhD, postdoc, MS, undergraduate — walks through a structured onboarding. The full checklist lives in the lab knowledge base; the outline is here.

**Week 1.** Handbook read and signed off; accounts set up (Slack, GitHub, Overleaf, cluster access, [DECIDE: Notion / Coda]); IT and building access; introductory 1:1 with the PI; introductory 1:1s scheduled with every current lab member.

**Weeks 2–4.** Reading list: 5–10 papers spanning SEAL's four pillars, plus 2–3 papers from the member's immediate project area. Weekly 1:1 with the PI on what they read, what they'd want to work on, and what's unclear. Pair up with a peer mentor (see below).

**Weeks 5–8.** Initial project scoped and proposed. First presentation to group meeting (a paper reading or the member's own past work). Baseline lab tooling comfort: cluster jobs run, one small code contribution merged, one paper feedback round given.

**Weeks 9–12.** First real deliverable committed and progressing. Semester plan written. First failure or blocker experienced and discussed openly.

**Peer mentor.** Every new member is paired with a peer mentor from the existing lab. The peer mentor's job is not to advise research; it's to be the person the new member can ask "is this normal?" without feeling like they should already know. Peer mentorship is a career-development skill and is treated as such.

**PI's first-90-days commitment.** Weekly 1:1s, not biweekly. Slower feedback on drafts is fine; faster feedback on onboarding questions is essential. The PI reads the semester plan carefully and pushes back where it seems off.

---

## 8. Wellbeing and Inclusion

**Workload.** Paid appointments in the lab follow CU Boulder norms: PhD students on assistantship are typically appointed at 20 hours per week (0.5 FTE GRA/GTA), sometimes 10 hours per week (0.25 FTE); undergraduate and MS RAs are usually appointed for 5–10 hours per week during term. International students on F-1 visas are legally capped at 20 hours per week of on-campus employment during the academic year (up to 40 during official university breaks). These are the paid appointment hours, and the lab does not ask members to exceed them.

PhD study itself — coursework, qualifying exam preparation, and self-directed dissertation research — is your degree, not employment, and is not tracked in hours or policed by the PI. What we do track is sustainability. Sustained overwork is not a signal of dedication; it is a signal that something is wrong. If work is regularly consuming evenings and weekends outside of a short pre-deadline push, that is a conversation with the PI, not a private problem.

[SEAL-SPECIFIC] International students on F-1 or J-1 status: raise any visa- or funding-timeline concerns with the PI early. The lab plans milestones and funding around your status, not the other way around.

**Vacation and rest.** PhD students and postdocs are expected to take real vacation — at least [DECIDE: 3–4] weeks per year of full disconnection from work, in addition to university holidays. The PI takes vacation and expects the lab to see this as normal.

**Illness and personal circumstances.** Nobody works while sick. Nobody is asked to justify a personal or family emergency. If a deadline needs to slip, it slips.

**Mental health.** Graduate school is unusually hard on mental health. [CU-SPECIFIC: link to CU Boulder counseling services, ombuds, disability services] Talking to the PI about mental health is fine and does not affect professional standing. The PI is not a therapist and will not try to be one.

**Accessibility.** The lab commits to accessibility in meetings, publications, and materials: captions when possible, screen-reader-compatible documents, physical space arranged for accessibility, flexible attendance for meetings. Members with accessibility needs are invited to raise them at any time.

**Discrimination and harassment.** SEAL does not tolerate discrimination, harassment, or bullying of any kind — including from the PI. Reports can be raised with the PI, the department chair, or CU Boulder's Office of Institutional Equity and Compliance, depending on the situation. Retaliation against anyone who raises a concern in good faith is itself a serious violation.

**Time zones and family.** Meetings are scheduled to accommodate lab members with caregiving responsibilities and, where possible, international collaborators' time zones. Standing meetings are avoided during predictable school pickup hours where they conflict for members.

---

## 9. Compute, Data, and Tools

**Compute.** The lab uses [DECIDE: CU Research Computing (Alpine/Blanca) / dedicated SEAL cluster resources / cloud (AWS/Azure/GCP credits)]. Allocation is: [DECIDE — default policy]. Job scheduling etiquette: don't hog interactive nodes; long jobs go to batch queues; if you kill a node, tell the group.

**Data.** All lab data lives in [DECIDE: named location]. Personal copies on laptops are permitted for active work but are not the source of truth. Data with any sensitivity (community-sourced, human-subjects, licensed) has additional handling rules — see Section 12.

**Code.** All lab code lives in the [DECIDE: SEAL GitHub organization]. Every project has a repo from day one; even exploratory work goes in a repo. README, environment file, and a `reproduce.md` are the minimum for any repo that supports a paper. Code is released publicly at paper acceptance unless there is a specific reason not to (discussed with the PI).

**Tools we standardize on.** [DECIDE: Overleaf for papers; GitHub for code; Slack for chat; Notion or Coda for knowledge base; Zotero group library for references; W&B or similar for experiment tracking.] Members can use whatever additional tools they like personally; deliverables that other lab members interact with use the shared stack.

**Backups.** Everything important is in a system that backs itself up (GitHub, Overleaf, cluster storage). Laptop-only artifacts are not backed up and will eventually be lost; plan accordingly.

---

## 10. External Engagement

**Conferences.** Lab members are expected to attend at least one major conference per year once they have relevant work; the lab covers travel where funding permits. Presenting others' work (posters, demos) counts. Junior members are matched with senior members for their first conference.

**Talks.** Members give internal practice talks before any external invited talk or conference presentation. The PI reviews slides at least 48 hours in advance for high-stakes talks.

**Social media.** [DECIDE the lab stance.] Default draft: lab members represent themselves, not the lab, when posting on personal accounts. The lab's own accounts are managed by [DECIDE]. Members are welcome to share lab work, but avoid claiming results before publication and be cautious about representing collaborators' views.

**Media requests.** Media requests about SEAL work go to the PI first, who will coordinate with CU communications. Members are free to talk to journalists about their own work but should loop the PI in for anything involving policy claims or attribution to the lab.

**Outside collaborations.** Lab members are welcome to collaborate outside SEAL; the PI is told, not asked. Internships and consulting: allowed with PI notification; not allowed to conflict with core research responsibilities. NDAs signed for outside work do not extend to SEAL work.

---

## 11. Career Development and Mentorship

**Individual development plan.** Each PhD student and postdoc maintains an IDP, updated every semester: research goals, skill goals, career goals, timeline, milestones. Discussed with the PI in a dedicated meeting each semester (separate from research 1:1s).

**Career paths.** SEAL supports academic, industry research, industry engineering, policy, and non-traditional career paths equally. The PI's advising does not privilege one path over another. Members interested in a particular path are connected to alumni, external mentors, and internship opportunities appropriate to it.

**Internships.** PhD students are encouraged (not required) to do at least one industry or lab internship during their PhD. Timing is discussed with the PI at least six months in advance.

**Letters of recommendation.** The PI will write strong letters for any lab member who has worked with them for at least a semester. Members give the PI at least three weeks of notice for any letter, ideally more.

**External mentorship.** Every PhD student is encouraged to build a relationship with at least one mentor outside SEAL (in the department, at another institution, in industry). The PI actively supports this and treats it as insurance, not competition.

---

## 12. Data Ethics and Community Engagement [SEAL-SPECIFIC]

Much of SEAL's work touches languages, dialects, and communities that have been historically underrepresented, extracted from, or misrepresented in NLP research. The following norms are not optional.

**Community-sourced data.** Data collected from or about a specific linguistic community is treated as community-owned unless a clear licensing agreement says otherwise. Before a project involving such data begins, we identify: who the community is, who speaks for the community in this context, what benefit (if any) accrues to the community, and what representation of the community appears in our authorship and acknowledgments.

**Consent.** Where our data collection involves human subjects — including community-sourced text, speech, or dialect data — we go through CU Boulder IRB, and we design consent processes with the assumption that participants may not have prior familiarity with AI research norms. Consent is explained in plain language; withdrawal is possible at any time.

**Data release.** Data that could identify individuals or expose community-internal linguistic practices to inappropriate use (e.g., surveillance, mockery) is not released without explicit community input into the release plan. When in doubt, the default is: don't release, or release with meaningful access controls.

**Language and dialect representation.** We do not describe dialects or low-resource languages using deficit framings (e.g., "broken," "non-standard," "informal"). We use the community's preferred terminology where possible and cite linguistic literature accurately.

**Adversarial work.** Our safety and red-teaming work involves generating or eliciting harmful content in dialects and languages. We take specific precautions: harmful outputs are not stored beyond what is needed for analysis; datasets released for the community's benefit are separated from datasets used only for evaluation of harm; publications describing attacks include discussion of mitigations and responsible disclosure timelines.

**Speech Accessibility Project and similar collaborations.** Data received under DUA is used strictly within the terms of the agreement; questions about scope go to the PI before anyone downloads or processes data.

---

## 13. Appendices and Templates

The following are maintained in the lab knowledge base and updated regularly. They are not reproduced here in full because they change often.

- Project proposal template
- Weekly 1:1 agenda template
- Semester plan template
- Onboarding checklist (first 90 days)
- IDP (individual development plan) template
- Paper submission checklist
- Data handling protocol template
- Conference travel and reimbursement checklist
- Media / talk request template
- Peer mentorship guide

---

## Change log

- **v1.0** — [DATE] — Initial version. Author: Jason Lucas.

---

## Notes on this draft (for the PI)

A few things to look at as you go through:

- **The [DECIDE] tags are the load-bearing ones.** These are choices you can't defer — Slack norms, meeting cadence, compute allocation, dispute-resolution person. Everything else is more editorial.
- **Sections 3 (Authorship), 6 (Project Lifecycle), and 8 (Wellbeing)** are the sections where I'd expect the biggest downstream impact of getting the norms right. Prioritize those in your first pass.
- **Section 12 (Data Ethics) is SEAL-specific and I've drafted it firmer than most handbook sections would.** Given the trajectory of your community-facing work, I think the extra firmness is a feature, but you may want to soften or reframe.
- **What's missing that you may want.** A section on lab finances (student funding transparency, TA vs RA norms), a section on IP and startups (if any lab work has commercialization potential), a section on international students and immigration (given your recruiting pipeline).
- **Signing off.** Consider having every new member read this handbook and sign off in a shared document during onboarding. The signoff is symbolic but powerful — it makes the norms mutually acknowledged rather than one-sided.
