"use client";

import React from "react";
import "@/app/styles.css";
import { Editor } from "@/app/text-editor";

export default function Home() {
  return (
    <div className="App">
      <Editor />
    </div>
  );
}
