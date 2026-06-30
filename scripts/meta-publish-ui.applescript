-- One-click helper: publishes pending Ads Manager drafts in Chrome.
-- Requires: Chrome open on Ads Manager, Accessibility permission for Script Editor/Terminal.
tell application "Google Chrome" to activate
delay 1
tell application "System Events"
  tell process "Google Chrome"
    set frontmost to true
    -- Chrome web UI isn't exposed as native buttons; use View > Developer > Allow JavaScript from Apple Events, then run meta-publish-ui.js instead.
  end tell
end tell
display dialog "In Chrome Ads Manager, click the blue button: Review and publish (16) then Confirm publish." buttons {"OK"} default button 1