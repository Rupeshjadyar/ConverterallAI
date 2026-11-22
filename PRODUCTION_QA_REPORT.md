# ConverterAll AI production QA report

**22 November 2026 · Hold release**

The baseline found two critical PDF defects. Redact PDF and Add Password advertised protections that their original processing code did not apply. This report retains the baseline evidence and records the Angular follow-up below.

## Angular follow-up

| Workflow | Verification |
| --- | --- |
| Redact PDF | Drew an area over test text, exported two pages, and rendered the result. The target was blacked out and neither page retained extractable text. The export flattens forms and links. |
| Add and Remove Password | Created an AES-256 encrypted PDF, rejected an incorrect password, and reopened the unlocked result with both pages and the test form field intact. [QPDF WASM](https://github.com/neslinesli93/qpdf-wasm) |
| Word, Excel, and PowerPoint | Downloaded DOCX text, an XLSX workbook with worksheet cells, and a PPTX with image slides. Word and Excel use selectable source text. PowerPoint preserves the visible pages as slide images. |
| English OCR | Uploaded an image-only PDF and downloaded a searchable PDF. The browser OCR engine recognized the test invoice number. [Tesseract.js](https://github.com/naptha/tesseract.js) |
| Lossless PDF compression | Reduced the tested two-page fixture from 3,373 to 1,887 bytes while retaining its form field and text. The page keeps the original when the compressed candidate would be larger. |
| Audio Format Converter | Converted a three-second WAV to a genuine MP3 and decoded the result in Chrome. WAV remains available. |
| Background Remover | Restored model delivery through the default IMG.LY CDN. A cold-cache browser run downloaded a PNG with transparency at the source dimensions. The first run took longer than the 75-second test window. [IMG.LY Background Removal](https://github.com/imgly/background-removal-js) |
| Cookie preferences | Verified no analytics events or ad-script requests before opt-in, one analytics event after opt-in, and removal of the analytics identifier when returning to Essential Only. |
| PDF/A | Retired the placeholder download and removed the promotional listing. The old URL shows the feature as unavailable. |

The Angular production build, TypeScript check, HTTP smoke test, and 72-test unit suite passed. The initial production bundle is 870.60 kB before transfer compression.

### Remaining release work

- **Backend and services.** Protect private admin data on the server and replace the fixed data-savings metric with actual measurements. Configure hosted Text to MP3, direct contact delivery, and the production multiplayer service.
- **Conversion capabilities.** Implement and validate PDF/A conformance. True voice cloning and OGG or AAC export still need engines. Video extraction and the audio editor currently export WAV. Background Remover still needs its batch and resolution options checked before those options are promoted.
- **Staging QA.** Verify the deployed hosting and CDN configuration, the first-load bundle budget, and large files on physical phones, Safari, and Firefox. Retest multiplayer join and reconnect with two independent clients.

## How the app was tested

I ran the local Angular production build and used Chrome browser automation for page navigation, file-picker uploads, downloads, form submissions, and selected mobile and admin checks. The test inputs were generated PNG and JPEG images, WAV and MP3 audio, videos with audio tracks, and small PDFs. I checked output signatures and used image dimensions, audio duration, or PDF page count where practical.

The route inventory came from the app router and sitemaps. The feature checks focused on the main converter workflows and representative user journeys. Ads, analytics vendors, and remote fonts were isolated from the page sweep. Tests used a temporary telemetry store. Contact testing used a local form submission and synthetic data.

## Verified results

- **245 of 245 browser route checks passed** on the routing regression build, covering 219 pages, 23 aliases, and 3 expected 404 responses. A separate SEO audit covered 218 sitemap pages.
- **72 of 72 unit tests passed** after fixes to test router setup. The baseline had 5 failures across 4 test files.
- **Build and SEO.** The production build, TypeScript check, and HTTP smoke test passed. The SEO audit returned zero errors and one title-length warning on Chess.
- **Image files.** Converted a 480 × 320 PNG to PNG and WebP and checked both signatures and dimensions. The previous download disappeared after changing the target. A corrupt image showed a recoverable error, a square crop produced a 320 × 320 PNG, compression reduced the JPEG fixture from 17,485 to 11,740 bytes, and rotation produced a 320 × 480 image. Uploading both image fixtures to Images to PDF produced a valid two-page PDF.
- **Batch images.** A two-file PNG and JPEG upload produced two correctly named downloads. The JPEG shrank to 8,170 bytes and the PNG was kept at its original size.
- **Audio and video files.** Verified the cutter reduced a 3-second WAV to 1.5 seconds, the 2× speed preset produced 1.5 seconds, and the joiner produced 5 seconds from two inputs. Booster, reverser, equalizer, and compressor also produced valid WAV files. After the fix, a real MP3 converted to WAV, MP4/AAC and WebM/Opus each produced 2 seconds of valid WAV, and the editor's export matched its file extension. The batch UI recovered when a corrupt WAV and a valid WAV were selected together.
- **PDF files.** Merging a two-page PDF and a one-page PDF produced a valid three-page PDF. PDF compression preserved the two-page count, but the small text fixture grew from about 1.1 kB to 21.5 kB.
- **Contact and dashboard.** Contact showed email-draft instructions without claiming receipt. The `/admin` alias loaded `/dashboard`, the dashboard produced a JSON download, the country filter returned zero rows for an unmatched term, and the reset button was absent.
- **Other workflows.** The basic calculator returned 12 for `7 + 5`. Voice Cloning saved a profile from an uploaded WAV and kept the profile after reload.
- **Mobile smoke.** Eight representative pages fit a 390 px Chromium viewport without horizontal overflow, including the image and audio editors, PDF compression, dashboard, and Contact. The home page mobile menu opened.

## Fixes made

| Area | Change |
| --- | --- |
| Image Format Converter | Refreshes the result after decoding, invalidates it when the target changes, and shows a recoverable error for bad input. The download extension matches the encoded image. |
| Batch Image Compressor | Refreshes completed rows, processes files added during a running batch, and names downloads using the encoded image format. |
| Images to PDF | Removes the artificial upload delay that left the Convert button disabled. Uses the selected output quality and updates progress when image processing completes. |
| Background Remover | Removes the missing demo image and shows an upload prompt. Export becomes available after a processed preview exists. |
| Audio Converter, Audio Editor, Video to Audio | Exports the actual WAV data under a WAV filename. Updated controls and tool descriptions to match the supported output. True MP3, OGG, and AAC encoding remains follow-up work. |
| Audio editing tools | Removes the repeated `.wav` suffix from cutter, booster, speed changer, reverser, equalizer, and compressor downloads. |
| Routing | Fixes the old JPEG-to-PNG, games typing test, developer AI chat, and text-to-speech language links. Adds redirect regression checks to the production HTTP smoke test. |
| Contact | Replaces the simulated delivery confirmation with a prefilled email draft. The visitor sends it from their email app. |
| Dashboard | Makes the country filter reactive and removes the public Reset Data action. The reset API still requires the server-side token. |
| Unit tests | Adds router providers to the incomplete component tests and replaces the obsolete Angular starter-page assertion. |

## Baseline findings

| Priority | Finding | Acceptance criteria |
| --- | --- | --- |
| P0 | **Redact PDF and Add Password.** Small PDF uploads reached the processing screen, where the tested flows stalled. Code review found that both implementations re-save the PDF. Redaction input never changes the document and the password never reaches an encryption engine. | Publish these tools only after independent checks confirm removed text and images cannot be recovered, and a protected PDF requires the correct password to open. |
| P1 | **Other PDF claims and conversions.** PDF to Word, PowerPoint, Excel, OCR, and PDF/A reached the processing screen without an enabled download in the test window. PDF to Word constructs RTF while the page advertises DOCX. OCR and PDF/A re-save the original content, and the existing password-removal code ignores the supplied password. | Provide real implementations or adjust feature availability. Open outputs in independent readers, verify an OCR text layer with a scan, and validate generated PDF/A with a conformance checker. |
| P1 | **PDF compression fidelity.** The test fixture grew in size despite running through the compressor. The compressor's image-based output needs document quality checks. | Keep smaller valid originals when compression increases size, and verify searchable text, form fields, and image quality across representative PDFs. |
| P1 | **Hosted speech and Voice Cloning.** Text to MP3 received a 503 from the local production server with hosted speech disabled, and the fallback request failed in this environment. Voice Cloning uses generic speech synthesis with a pitch adjustment on its browser fallback. | Verify hosted speech in staging, use genuine encoded audio downloads, and align the voice feature name with the implemented capability. |
| P1 | **Background Remover model delivery.** The model manifest request to the configured CDN failed DNS resolution during browser testing. This blocked the real image removal check. | Test a cold-cache model download in staging, verify the resulting alpha channel, and provide a clear retry path when model delivery fails. |
| P1 | **Admin and telemetry design.** A fresh unauthenticated session can open the dashboard through `/admin`. The stats API exposes recent activity, and the client initializes telemetry before the cookie choice. Server metrics add a fixed 2 MB per tool event as data saved. | Decide which analytics are public, enforce access on private pages and APIs, wire the consent choice to tracking, and measure data savings from actual file operations. |
| P1 | **Release infrastructure.** The production build has an initial bundle of about 876 kB against a 500 kB warning budget. The static Vercel configuration serves browser assets, while the local production checks ran against the Express SSR server that provides the APIs. | Run the exact deploy artifact in staging, verify deep links and external services, and validate large-file behavior on a physical phone and across browsers. |
| P2 | **Warfare multiplayer.** With the local Socket.IO service running, the browser reached the game screen but waited for combatants without showing the player HUD during the join test. | Verify two independent clients can join, see each other, and reconnect on the production game service. |
| P2 | **Contact delivery.** The current form hands off to the visitor's email app. | For direct submission, implement and verify a server-side delivery provider and explicit handling of delivery failures. |

