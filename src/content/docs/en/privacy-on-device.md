---
title: "Privacy on your device"
description: "How Dusrel's pass tools and ShrinkIt process everything in your browser, so your files and inputs never leave your device."
category: concepts
type: explanation
updated: "2026-11-02"
draft: false
---


When you use most online tools, your input travels to a company's server, gets processed there, and the result comes back. Dusrel's quick tools and ShrinkIt work the other way around: the processing happens in your own browser, on your own device, so your files and inputs are never uploaded anywhere.

This page explains what that means, which products it covers, and where its limits are.

## What "on-device" means

<img src="/docs-sections/privacy-on-device-s1.jpg" alt="What &quot;on-device&quot; means" width="1200" height="675">


Your browser downloads the tool's code from dusrel.com, just like it downloads any web page. After that, everything happens locally:

- The text you type, the password you test, or the image you drop in is read by code running on your device.
- The work — generating, counting, checking, resizing, converting — runs on your device.
- The result is produced on your device, and you download or copy it from there.

There is no server step in the middle for these tools, and no account is required to use them. That is the whole mechanism: if your data is never sent, it cannot be stored, sold or leaked from a server that never received it.

## Which products this covers

<img src="/docs-sections/privacy-on-device-s2.jpg" alt="Which products this covers" width="1200" height="675">


This claim is deliberately narrow. It covers exactly these products:

- **The six pass tools** at dusrel.com/pass/: the password generator, password strength checker, username generator, word counter, QR code generator and age calculator. All six run entirely in the browser. This matters most for the password tools: a password you generate or test is never sent over the network, so testing a password here does not expose it to anyone.
- **ShrinkIt** (shrinkit.dusrel.com), the image resizer and compressor. Your images are decoded, resized and re-encoded in the browser — heavy work runs in a separate background worker so the page stays responsive — and the finished images are downloaded from your device. Image metadata (EXIF data) is stripped by default, so location and camera details are not carried into the output unless you deliberately choose to preserve them.

That is the full list. This page does not claim the same for any other app, and it says nothing about products that do not exist yet. Apps listed as coming soon, such as Drive, Chat and Mail, would by their nature need servers to store or deliver your data, so they cannot be covered by an on-device promise before they are even built. When such apps arrive, their own pages will describe how they handle data.

## What on-device processing does not do

<img src="/docs-sections/privacy-on-device-s3.jpg" alt="What on-device processing does not do" width="1200" height="675">


On-device processing is a real protection, but it is not magic. A few honest limits:

- **It protects your input from Dusrel's servers, not from your own actions.** If you take a generated QR code or a resized photo and post it publicly, that is your choice, and the result is public from then on.
- **It does not make your device itself private.** Other software on your device, such as browser extensions or a compromised device, is outside what a web page can control.
- **Loading the page still involves the network.** Your browser has to fetch the tool's code from dusrel.com in the first place. On-device processing is about what happens to your input after the page loads, not about hiding the fact that you visited the site.

## Why Dusrel builds this way

<img src="/docs-sections/privacy-on-device-s4.jpg" alt="Why Dusrel builds this way" width="1200" height="675">


The idea behind Dusrel is that useful software should not demand your data as the price of using it. Building tools that run entirely in the browser is one way to keep that promise concrete: instead of asking you to trust a policy, the tool is designed so that the data never leaves in the first place. Where a future product genuinely needs a server, Dusrel will need to say so plainly rather than stretch this claim to cover it.

## In short

<img src="/docs-sections/privacy-on-device-s5.jpg" alt="In short" width="1200" height="675">


For the pass tools and ShrinkIt: your input goes in, the work happens on your device, and the result comes out — with no upload step in between. For everything else, read that product's own page before assuming anything.
