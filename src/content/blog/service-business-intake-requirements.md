---
title: "Client intake requirements: what to prepare before adding AI"
description: Define the questions, routing rules, approved answers, and staff handoff your service-business intake workflow needs before implementation.
date: 2026-10-28
category: Enquiries
---

Before adding AI to client intake, write down which information changes the next action. If an answer does not affect qualification, routing, booking, or follow-up, it may not belong in the first conversation.

This checklist is for ordinary service inquiries, such as cleaning, maintenance, design, or consulting. It is not a specification for medical, legal, or financial intake.

## Define the outcome of the first conversation

Pick one primary outcome: a confirmed appointment, a request for a quote, or a callback. Do not present all three as the same thing.

A quote request needs enough information for someone to assess the job. A bookable consultation needs a defined appointment and availability. A callback needs a reachable contact and a responsible person.

Write the completion message at the same time as the questions. For a request that requires review, a useful example is:

> Thanks. Your request has been sent to our team for review. This is not a confirmed appointment. We will contact you using the details you provided.

Add a reply deadline only when your team can consistently meet it. See [handling after-hours inquiries](/blog/after-hours-enquiries/) for how to set an acknowledgment.

## Create a question-to-action table

Use a table like this hypothetical cleaning-business example. It is a suggested design, not an implemented customer workflow.

| Question | Why it is needed | What the answer changes |
|---|---|---|
| Which service do you need? | Select the appropriate path | Standard service continues; specialist work goes to review |
| Where is the property? | Check the service area | A postal code may be enough initially; full address can wait |
| One-time or recurring work? | Identify the right request type | Route to the relevant service owner |
| What email should we use? | Reply about this request | Save a contact method and show it for correction |
| Anything unusual about the job? | Identify exceptions | Keep optional; ask the visitor to avoid sensitive details |

Do not require both phone and email simply because the form supports them. Require the contact method your process actually uses. If a field is optional, label it that way.

For each question, also specify the accepted format, whether it is required, where it is stored, and who can see it. Ask for more detail later when it becomes necessary for the next step.

## Turn business knowledge into approved answers

Prepare a short source sheet covering services, areas served, hours, how pricing works, preparation instructions, and the handoff path. Assign an owner to each section so changes have somewhere to go.

Separate fixed facts from things that require judgment. “We serve these postal codes” can be an approved rule. “We can definitely finish this unusual job by Friday” may require a person.

For every uncertain case, supply a boundary and a next action:

- Unknown service: ask a clarifying question or send the request for review.
- Unlisted location: do not assume it is covered.
- Custom price: collect the brief without inventing a quote.
- Conflicting information: flag the source for correction and hand over.
- Request to speak to someone: make that route available without forcing more chat.

AI can still make mistakes. An approved source sheet supports review and correction; it is not a guarantee of perfect answers.

## Describe the staff handoff as carefully as the form

Choose one place where requests are recorded. Identify the person responsible for new requests and a backup when that person is away.

A useful handoff contains the customer's own request, contact details, service choice, unresolved question, and the next action. Distinguish facts supplied by the customer from a generated summary. Staff should be able to inspect the original message if the summary is unclear.

Decide how the workflow handles duplicates and incomplete requests. For example, a repeat message from the same person may update an existing request rather than create a second task. That behavior needs explicit agreement with the implementer.

Do not call a request “handled” merely because the form submitted. Check that the record exists and the responsible person can find it.

## Specify usable questions and errors

W3C's [form labeling guidance](https://www.w3.org/WAI/tutorials/forms/labels/) explains how labels identify controls, including for people using assistive technology. Ask your builder for clear labels rather than relying only on disappearing placeholder text.

Its [input validation guidance](https://www.w3.org/WAI/tutorials/forms/validation/) recommends identifying required inputs and helping people correct mistakes. Specify understandable error messages and keep valid information when someone corrects a field. Test keyboard use, mobile entry, missing required answers, and the confirmation screen.

A chat interface needs similar clarity: ask one understandable question at a time, allow corrections, and explain what will happen after submission. Keep a direct contact route for people who cannot or do not want to use chat.

## Prepare the brief you can hand to a builder

Collect these items in one document:

1. The primary outcome and the exact completion message.
2. Questions, accepted answers, and required or optional status.
3. Approved business facts and their update owner.
4. Qualification and exception rules.
5. Calendar or lead destination and necessary account access.
6. Staff owner, backup, and expected follow-up process.
7. Data access, retention, and deletion expectations to resolve before launch.
8. Acceptance scenarios with an observed-result column.

The next step is implementation, not adding more questions. Botlane offers an [AI website assistant](/custom-solutions/ai-assistant) for business questions and human handoff, and [workflow automation](/custom-solutions/workflow-automation) for connections between tools. Qualifying questions, existing-site compatibility, and the exact integrations should be confirmed in your proposal.

Send that brief with your project enquiry. If the desired outcome is a confirmed appointment, the [booking implementation guide](/blog/ai-appointment-booking-implementation/) explains the calendar and confirmation work that follows.
