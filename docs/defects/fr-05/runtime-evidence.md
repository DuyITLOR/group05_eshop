# FR-05 Defect Runtime Evidence

Runtime evidence below was captured in narrow Chromium reproduction flows against the existing SUT at `http://localhost:5173`. It supplements screenshots; screenshots alone do not prove invisible DOM semantics.

| Test Case ID | Runtime Evidence                                                                                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR05-TC-004  | Product image count: 1; `alt` attribute: empty string (`""`).                                                                                                                            |
| FR05-TC-005  | Displayed price: `30.000.000 VND`; required symbol: `₫`.                                                                                                                                 |
| FR05-TC-011  | Displayed text: `Kết quả tìm kiếm cho: FR05 HTML Keyword`; input-derived `b` element count: 1.                                                                                           |
| FR05-TC-012  | Dialog observer active; narrow capture recorded messages `FR05-XSS`, `FR05-XSS`; `img[onerror]` count: 1. Cross-browser suite evidence recorded Chromium 2 dialogs, Firefox 2, WebKit 1. |
| FR05-TC-014  | Semantic `h1` count: 2; text: `Danh sách sản phẩm`, `Hiển thị 5 sản phẩm`.                                                                                                               |

The cross-browser execution records remain the authoritative multi-browser runtime evidence. Defect reports link both this record and the approved HTML reports.
