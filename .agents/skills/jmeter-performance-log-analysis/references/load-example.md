# Load example: authenticated purchase workflow

Use this as a structural example only. Do not reuse its values as a threshold for another system.

## Scenario

- Tool: Apache JMeter 5.6.3 with Ultimate Thread Group.
- Workflow: Login -> Products -> Add to Cart -> Get Cart -> Checkout -> Get Order Detail.
- Schedule: 30 VU, 60-second ramp-up, 300-second hold, 30-second ramp-down.
- Think time: 1000 ms constant offset plus up to 2000 ms random delay.
- Data: one dedicated CSV account per VU.
- Output: raw JTL, HTML Dashboard, and screenshots tying backend port 3000 to its Node.js PID.

## Correlation and assertions

- Extract and assert JWT and user ID after Login.
- Select and assert a valid product from Products.
- Assert the Add to Cart response message.
- Assert that the cart contains the selected product.
- Extract and assert the order ID after Checkout.
- Assert that Order Detail matches the created order.

For a dependent workflow, `Start Next Thread Loop` prevents meaningless downstream calls after a failed sampler. Verify its actual behavior with the chosen Thread Group plugin.

## Observed run

The verified HTML report recorded:

- 1,043 E2E transaction samples.
- 0 errors.
- About 2.70 E2E transactions/second.
- About 16.06 request samples/second.
- Backend memory around 156 MB in the captured sustained-load evidence.
- Backend CPU displayed as `00` in Task Manager because usage was below its integer display precision.

These values describe one machine and one run. They are evidence, not a reusable SLO.

## Lessons from review

- Resolve test-data paths relative to the JMX location so GUI and CLI runs use the same file.
- Seed accounts after backend startup when startup recreates the database.
- Use unique JTL and HTML paths; stale or appended logs can contaminate analysis.
- A Transaction Controller can make terminal, listener, JTL, and HTML counts appear different.
- Do not infer loop behavior from one terminal summary. Check raw labels, timestamps, thread names, and HTML statistics.
- A raw JTL row count includes both transaction parents and request children when subresults are saved.
- During ramp-down, later steps may have fewer samples because a thread can stop before completing another workflow.

