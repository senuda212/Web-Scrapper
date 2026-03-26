import React from "react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"

export default function SpiderCodeEditor({ code }) {
  return <CodeMirror value={code} extensions={[python()]} theme="dark" editable={false} height="320px" />
}
