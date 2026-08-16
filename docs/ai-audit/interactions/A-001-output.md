**CONTROLLED INTEGRATION TEST**

Endpoint: `POST /api/apply-coupon`  
Group: `TRANSACTIONAL`  
Scenario: `STRESS`

Current State: `HUMAN_DESIGN_REVIEW_REQUIRED`

Generated Artifact: [stress-apply-coupon-design.md](D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\docs\performance-design\stress-apply-coupon-design.md)  
Workflow State: [hw05-performance-workflow-status.md](D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\docs\workflow\hw05-performance-workflow-status.md)

Think Time Contract: PASS  
`Constant Timer`, `Delay: 1000 ms`, mapping explicit.

DATA_DRIVEN_FIT: PASS  
`CSV_MODE: REQUEST_DRIVEN`; `code`, `total_amount`, `user_id` drive the request body.

Authority / API-source consistency: PASS for method/body. Supporting README authentication/boundary rules still require Human Review against current handler behavior.

Audit: BLOCKED — `AUDIT_INITIALIZATION_INFORMATION_REQUIRED` because no audit log exists and Student Information is unavailable.

No JMeter, JMX, JTL, execution HTML report, screenshot, commit, or push was created.

Next Allowed Action: Review the design and record `APPROVED`, `MODIFIED_AND_APPROVED`, or `REJECTED`.