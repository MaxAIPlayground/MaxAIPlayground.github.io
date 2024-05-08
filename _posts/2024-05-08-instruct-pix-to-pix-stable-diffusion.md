---
layout: post
title:  "Single Image Transformations: Exploring Instruct Pix2Pix in Stable Diffusion"
date:   2024-05-08 10:00:00 +0200
permalink: /:title/
image: "/images/instruct-pix-to-pix-stable-diffusion-ep2/cover.jpeg"
image2x: "/images/instruct-pix-to-pix-stable-diffusion-ep2/cover@2x.jpeg"
tags: stable-diffusion pix2pix
---

**What exactly is _Pix2Pix_?** This Stable Diffusion model transforms images based solely on textual instructions. Timothy Brooks, the [model's](https://www.timothybrooks.com/instruct-pix2pix) creator, defines it as "Learning to Follow Image Editing Instructions". The simplicity of Pix2Pix opens a realm of possibilities for anyone interested in AI-driven image editing.

**The Idea**: Transform any image with _minimal effort_.

**The Goal**: To manipulate images quickly and without any prior editing skills (aka Photoshop).

**The Use Case**: This exploration started with an aim to automate the generation of YouTube thumbnails by changing facial expressions via simple commands.

**The Annoyance**: Traditional photo editing requires time and effort I'd rather not spend, and manual edits in Photoshop or inpainting in Stable Diffusion often lead to frustrating cycles of trial and error. 😬

### Table of Contents
1. **Set Up InstructPix2Pix**
2. **Choose a Base Image**
3. **Select an Effective Prompt**
4. **Examples of Transformations**
5. **Comparisons with Embeddings and epiCPhotoGasm**

## Step 1: Setting Up the Instruct Pix2Pix Model (MacBook M1)

### Download and Select the Model
Ensure the web UI is operational by following the [official instructions](https://github.com/AUTOMATIC1111/stable-diffusion-webui?tab=readme-ov-file#installation-and-running "AUTOMATIC1111 stable-diffusion-webui installation").

**Side note**: All of the following steps were taken on a MacBook M1.

Initially, download the ckpt or safetensors model from the [Hugging Face repository](https://huggingface.co/timbrooks/instruct-pix2pix/tree/main "InstructPix2Pix repository at huggingface") and place it in the `models\Stable-diffusion` directory. Refresh and select the `instruct-pix2pix-00-22000` model from the dropdown menu.
![instruct-pix2pix-00-22000](/images/instruct-pix-to-pix-stable-diffusion-ep2/pix2pix-model-selection.png){:.max-w-sm}

**Additional note**:<br>
I encountered issues using ControlNet with the error message: `Cannot recognize the ControlModel`. Although it ultimately did not affect the outcomes, to avoid potential issues, I recommend not enabling ControlNet and loading the model directly as a Stable Diffusion checkpoint in case you also get this error.

## Step 2: Choose Your Base Image
{% include image.html url="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg" caption="A younger and prettier version of me 😳" %}{:.max-w-sm}

## Step 3: Crafting Effective Prompts
To maximize the model's effectiveness, articulate your desired changes as if you were instructing Photoshop. This model excels when directives are precise, whether it’s altering the lighting, adjusting colors, or removing and replacing elements.

Here are some successfully tested prompt examples (credit to Andrew from [stable-diffusion-art.com](https://stable-diffusion-art.com/instruct-pix2pix/ "article on stable-diffusion-art.com")):

- Change to `style name` style, e.g. `Change to cartoon style`
- Make `person` look like `object or person`, e.g. `Make him look like a dog`
- Add `object`, e.g. `Add tomatoes to the table top`
- Replace `object` with `something else`, e.g. `Replace the water with sand`
- Put `object or person` in `scene or background`, e.g. `Put him in latent space`
- Make it `area, country or city`, e.g. `Make it Berlin`

**Important**: Set the Denoising strength to 1 to ensure the model functions properly.

## 4. Examples
Let's explore a range of outcomes from successful transformations to... learning experiences. 🤓

{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-gold.png"
    prompt="make it look like a golden statue"
    parameters="
Negative prompt: Disfigured, cartoon, blurry, nude
Steps: 24, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8, Image CFG scale: 1.75, Seed: 3207543649, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="This is one of the prompts from the author's website and it works quite well here, too."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-blonde-hair.png"
    prompt="make the hair and eyebrows blond"
    parameters="
Steps: 24, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 10, Image CFG scale: 1.75, Seed: 1977613539, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="Funny, actually."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-eyes-closed.png"
    prompt="close their eyes"
    parameters="
Negative prompt: Disfigured, cartoon, blurry, nude
Steps: 24, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8, Image CFG scale: 1.6, Seed: 1405665529, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="This prompt worked very well and it's pretty realistic, too."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-furious.png"
    prompt="make him look furious"
    parameters="
Negative prompt: bad eyes, low quality
Steps: 40, Sampler: Euler, Schedule type: Automatic, CFG scale: 7.5, Image CFG scale: 1.6, Seed: 1580611629, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="Excellent result, one of the best transformations."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-angry-pix2pix.png"
    prompt="make him angry"
    parameters="
Steps: 38, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8, Image CFG scale: 1.55, Seed: 2086482578, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="If I was you, I'd leg it! 🔥 Quite a good result, but the mouth requires some inpainting."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-horror.png"
    prompt="make him terrifying"
    parameters="
 Steps: 50, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 9, Image CFG scale: 1.4, Seed: 4091701604, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="This is just a... fail!"
 %}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-mature.png"
    prompt="make him look more mature"
    parameters="
Negative prompt: bad teeth, bad quality, medium quality, blurry
Steps: 42, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 7.5, Image CFG scale: 1.75, Seed: 353877794, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="Accepted! This is impressive and I could imagine myself looking like this one day, perhaps... 🤔"
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-paint.png"
    prompt="apply face paint"
    parameters="
Steps: 50, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 7.5, Image CFG scale: 1.5, Seed: 2442579842, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="I'm undecided on this one. Might have to give it a try some time. 😅"
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-pixelate-bg.png"
    prompt="pixelate the background"
    parameters="
Negative prompt: Disfigured, cartoon, blurry, nude
Steps: 24, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8, Image CFG scale: 1.25, Seed: 3683370930, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="I love the pattern on this."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-snow.png"
    prompt="what would it look like if it were snowing?"
    parameters="
Steps: 24, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 7.5, Image CFG scale: 1.5, Seed: 538119155, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="I really like this one. This would have taken ages in Photoshop, at least for me..."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-suit.png"
    prompt="make them wear a suit"
    parameters="
Negative prompt: Disfigured, cartoon, blurry, nude
Steps: 30, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8, Image CFG scale: 1.6, Seed: 3460861800, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="Suit up! 🕴️"
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-sunglasses.png"
    prompt="add sunglasses"
    parameters="
Negative prompt: bad teeth, bad quality, medium quality, blurry
Steps: 24, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 10, Image CFG scale: 1.75, Seed: 3201085422, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="Wow, talk about extravagant!"
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-younger.png"
    prompt="make the person 10 years younger"
    parameters="
Negative prompt: Disfigured, cartoon, blurry, nude
Steps: 40, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8, Image CFG scale: 1.5, Seed: 3919771410, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="Doesn't really look much younger but rather more southern (that means Italian since that is south of Germany)"
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-celebrity1.png"
    prompt="make them look like a celebrity"
    parameters="
Negative prompt: Disfigured, cartoon, blurry, nude
Steps: 36, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8.5, Image CFG scale: 1.1, Seed: 1197305648, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="Seems like I might need a nose job and a hairstyle update in the middle..."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-celebrity2.png"
    prompt="make them look like a celebrity"
    parameters="
Negative prompt: Disfigured, cartoon, blurry, nude
Steps: 36, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8.5, Image CFG scale: 1.1, Seed: 1197305647, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="A sexy version of me."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-hair-gray.png"
    prompt="make the hair gray"
    parameters="
Steps: 42, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 7.5, Image CFG scale: 1.5, Seed: 2180229889, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="One more version of sexy me since it's so much fun!"
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-leather-jacket.png"
    prompt="make his sweater a leather jacket"
    parameters="
Steps: 24, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 7.5, Image CFG scale: 1.5, Seed: 291088540, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="Impressive, but it looks almost like there's also a leather bag on the top of the left shoulder. I suppose this is due to the source image being a bit wrinkly in that area."
%}

### Observations
Pix2Pix shines in style changes and object replacement but struggles with complex facial expressions and scenery adjustments. The key to make it work often lies in adjusting the `Image CFG` and CFG Scales based on what the prompt demands. It fails on viewpoint changes and sometimes it fails to isolate the specified object.

If an image doesn't change at all, usually you'd lower either the Image CFG Scale (try 1.25 or even lower if 1.5 does nothing for you) or increase the CFG Scale of the actual prompt (try 8-9 if 7.5 was your baseline).

Evoking strong emotions from a neutral facial expression is challenging with Pix2Pix. In such cases, I recommend using a custom embedding or checkpoint, as illustrated below.

### Takeaways

**Challenges**: Changing facial expressions is as tough as traditional image editing. Subtle changes are more reliably achieved than complete overhauls.

**Strengths**: Ideal for straightforward tasks like color changes or background swaps.

**Limitations**: Struggles with dramatic emotional expressions due to issues with detailing in areas like the mouth and eyes.

Remember, the effectiveness of Pix2Pix can vary dramatically based on the specificity of your prompts and the settings you choose. What works in Photoshop can often be replicated here, albeit with some practice and patience.

## Taking It further

### Changing Facial Expressions
To more effectively alter facial expressions, an alternative approach using custom embeddings proves more promising.

In order to accomplish this, we need to use another method. I explored several embeddings over at [civitai](https://civitai.com/models/8860) such as [Nervous512](https://civitai.com/models/8860?modelVersionId=10467), [Grin512](https://civitai.com/models/8860?modelVersionId=10465) or [Sad512](https://civitai.com/models/8860?modelVersionId=10471).

Here are some specific emotions tailored for different expressions:

- [SCG Emotions: Smile512](https://civitai.com/models/8860?modelVersionId=10464)
- [SCG Emotions: Shock512](https://civitai.com/models/8860?modelVersionId=10468)
- [SCG Emotions: Angry512](https://civitai.com/models/8860?modelVersionId=10470)

After downloading these embeddings, simply place them in the `embeddings` folder and use them as follows:
```
a <embedding_name> man, e.g. a happy512 man or a angry512 man
```

## 5. Examples Using Embeddings

{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-smile.png"
    prompt="a happy512 man"
    parameters="
Steps: 32, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 7.5, Image CFG scale: 1.5, Seed: 481831985, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, TI hashes: \"happy512: 4fa643103a06\", Version: v1.9.3"
    opinion="Achieving a realistic smile is challenging. The embedding has a hard time to get the teeth right. Additional inpainting is required."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-smile512-bad-teeth.png"
    prompt="a portrait of smile512 man"
    parameters="
Negative prompt: low quality, deformed
Steps: 30, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 7.5, Image CFG scale: 1.9, Seed: 1944199414, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    opinion="Teeth are slightly better, but not great either. We'll have to make the extra effort and use inpainting here as well."
%}

Using inpainting might yield similar results, but it requires more effort to manually create masks for areas like the eyes and cheeks. In contrast, using an embedding automates this process, considering the entire face without the need for detailed manual adjustments.

### In Comparison
Let's compare pix2pix with the `smile512` embedding:
{% include prompt-image-alt.html
    compare1="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-smile512-bad-teeth.png"
    compare2="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-smile512.png"
    prompt1="make him smile"
    prompt2="a smile512 man"
    parameters1="
Negative prompt: low quality, deformed
Steps: 30, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 7.5, Image CFG scale: 1.9, Seed: 1944199414, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    parameters2="
Negative prompt: low quality, deformed
Steps: 33, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 7.5, Image CFG scale: 1.8, Seed: 2661397260, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, TI hashes: \"smile512: 2ad4e0cac932\", Version: v1.9.3"
    opinion="Tough to say which one is the winner here... Both aren't exactly great. It's probably a tie."
%}

Now let's compare pix2pix with the `sad512` embedding:
{% include prompt-image-alt.html
    compare1="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-sad.png"
    compare2="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-sad512.png"
    prompt1="make him ((sad))"
    prompt2="a portrait of a (sad512) man"
    parameters1="
Negative prompt: low quality, deformed
Steps: 24, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8, Image CFG scale: 1.5, Seed: 3712488430, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    parameters2="
Negative prompt: low quality, deformed
Steps: 32, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8, Image CFG scale: 1.35, Seed: 1736296393, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, TI hashes: \"sad512: d27225db52e6\", Version: v1.9.3"
    opinion="Rendered a deeper sadness but introduced some unwanted color shifts. I'd say left (pix2pix) is the winner here."
%}

### Alternate Approach Using ADetailer and epiCPhotoGasm
A popular checkpoint on civitai, [epiCPhotoGasm](https://civitai.com/models/132632/epicphotogasm), offers an alternate method for facial manipulation. After downloading, place it in your models\Stable-Diffusion folder. ADetailer, utilizing `face_yolov8n.pt`, focuses modifications on facial features when img2img is enabled—ideal for precise adjustments.

Interestingly, epiCPhotoGasm operates nearly twice as fast as the Pix2Pix model on my setup, showing promising results:

#### Comparative Outcomes Using ADetailer and epiCPhotoGasm

{% include prompt-image-alt.html
    compare1="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-sad.png"
    compare2="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-sad-epicphotogasm.png"
    prompt1="make him ((sad))"
    prompt2="a portrait of a ((sad)) man"
    parameters1="
Negative prompt: low quality, deformed
Steps: 24, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8, Image CFG scale: 1.5, Seed: 3712488430, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    parameters2="
Steps: 1, Sampler: Euler, Schedule type: Automatic, CFG scale: 7.5, Seed: 1373581547, Size: 128x128, Model hash: e44c7b30c6, Model: epicphotogasm_ultimateFidelity, Denoising strength: 1, ADetailer model: face_yolov8n.pt, ADetailer confidence: 0.3, ADetailer dilate erode: 4, ADetailer mask blur: 4, ADetailer denoising strength: 0.45, ADetailer inpaint only masked: True, ADetailer inpaint padding: 96, ADetailer use separate CFG scale: True, ADetailer CFG scale: 9.0, ADetailer use separate CLIP skip: True, ADetailer CLIP skip: 2, ADetailer version: 24.4.2, Version: v1.9.3"
    opinion="Pix2Pix offers a reliable baseline, while epiCPhotoGasm allows for more nuanced expressions with some trade-offs."
%}

{% include prompt-image-alt.html
    compare1="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-shocked.png"
    compare2="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-shocked-epicphotogasm.png"
    prompt1="make him look (shocked)"
    prompt2="a portrait of a ((shocked)) man"
    parameters1="Steps: 30, Sampler: DPM++ 2M, Schedule type: Karras, CFG scale: 8.5, Image CFG scale: 1.45, Seed: 3780110914, Size: 512x512, Model hash: ffd280ddcf, Model: instruct-pix2pix-00-22000, Denoising strength: 1, Version: v1.9.3"
    parameters2="Steps: 1, Sampler: Euler, Schedule type: Automatic, CFG scale: 10, Seed: 626819233, Size: 128x128, Model hash: e44c7b30c6, Model: epicphotogasm_ultimateFidelity, Denoising strength: 1, ADetailer model: face_yolov8n.pt, ADetailer confidence: 0.3, ADetailer dilate erode: 4, ADetailer mask blur: 4, ADetailer denoising strength: 0.44, ADetailer inpaint only masked: True, ADetailer inpaint padding: 84, ADetailer use separate CFG scale: True, ADetailer CFG scale: 8.5, ADetailer use separate CLIP skip: True, ADetailer CLIP skip: 2, ADetailer version: 24.4.2, Version: v1.9.3"
    opinion="This one was tough for pix2px, as seems to be the case when trying to use strong facial expressions such as shock. epiCPhotoGasm is the clear winner here."
%}

The `Inpaint denoising strength` is crucial here. The default setting of 0.4 generally works well, but slight adjustments can greatly influence the outcome, sometimes at the expense of character recognizability.

Experiment with `Inpaint only masked padding, pixels` to potentially achieve a broader range of facial expressions. Increasing this setting to about 100 has proven effective in some of my tests.

Here are the complete settings I've used in ADetailer for most of my comparisons:
![ADetailer Settings](/images/instruct-pix-to-pix-stable-diffusion-ep2/adetailer-settings.png)

This model works very well with age manipulation and ethnicities. Here are some examples:
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-aged-epicphotogasm.png"
    prompt="a portrait of an old man"
    parameters="
Steps: 1, Sampler: Euler, Schedule type: Automatic, CFG scale: 7.5, Seed: 2440307707, Size: 128x128, Model hash: e44c7b30c6, Model: epicphotogasm_ultimateFidelity, Denoising strength: 1, ADetailer model: person_yolov8n-seg.pt, ADetailer confidence: 0.3, ADetailer dilate erode: 4, ADetailer mask blur: 4, ADetailer denoising strength: 0.35, ADetailer inpaint only masked: True, ADetailer inpaint padding: 64, ADetailer use separate CFG scale: True, ADetailer CFG scale: 8.0, ADetailer use separate CLIP skip: True, ADetailer CLIP skip: 2, ADetailer version: 24.4.2, Version: v1.9.3"
    opinion="Very impressive!"
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-young-epicphotogasm.png"
    prompt="a portrait of a young man"
    parameters="
Steps: 1, Sampler: Euler, Schedule type: Automatic, CFG scale: 7.5, Seed: 1667935321, Size: 128x128, Model hash: e44c7b30c6, Model: epicphotogasm_ultimateFidelity, Denoising strength: 1, ADetailer model: person_yolov8n-seg.pt, ADetailer confidence: 0.3, ADetailer dilate erode: 4, ADetailer mask blur: 4, ADetailer denoising strength: 0.36, ADetailer inpaint only masked: True, ADetailer inpaint padding: 64, ADetailer use separate CFG scale: True, ADetailer CFG scale: 8.5, ADetailer use separate CLIP skip: True, ADetailer CLIP skip: 2, ADetailer version: 24.4.2, Version: v1.9.3"
    opinion="Besides minor issues with the right eye, a very good result."
%}
{% include prompt-image.html
    base="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-profile-base.jpg"
    result="/images/instruct-pix-to-pix-stable-diffusion-ep2/max-japanese-epicphotogasm.png"
    prompt="a portrait of a japanese man"
    parameters="
Steps: 1, Sampler: Euler, Schedule type: Automatic, CFG scale: 7.5, Seed: 1776054093, Size: 128x128, Model hash: e44c7b30c6, Model: epicphotogasm_ultimateFidelity, Denoising strength: 1, ADetailer model: person_yolov8n-seg.pt, ADetailer confidence: 0.3, ADetailer dilate erode: 4, ADetailer mask blur: 4, ADetailer denoising strength: 0.36, ADetailer inpaint only masked: True, ADetailer inpaint padding: 64, ADetailer use separate CFG scale: True, ADetailer CFG scale: 8.5, ADetailer use separate CLIP skip: True, ADetailer CLIP skip: 2, ADetailer version: 24.4.2, Version: v1.9.3"
    opinion="Interesting for sure. 🇯🇵"
%}

### Conclusion
While epiCPhotoGasm has outperformed other methods in terms of speed and ease of use for my specific needs—such as altering facial expressions from neutral to more expressive states—it is not without its flaws. The results, while quick, may not always be reliable enough for applications like YouTube thumbnail generation where accuracy in expression and a flawless result is crucial.

Unfortunately, the current solutions require significant tweaking to meet my needs fully. In my opinion, the currently available methods aren't quite there yet without going the extra mile or adding a disproportionate ton of effort.

Check below for an [interesting upcoming project](https://stylus-diffusion.github.io/) that I'll be testing out once the code has been released.

### Tools Used In This Post
- Stable Diffusion web UI ([AUTOMATIC1111](https://github.com/AUTOMATIC1111/)) v1.9.3 (using Mac OS Sonoma 14.3)
- Models: [instruct-pix2pix-00-22000.ckpt](https://huggingface.co/timbrooks/instruct-pix2pix/resolve/main/instruct-pix2pix-00-22000.ckpt?download=true) and [epiCPhotoGasm model](https://civitai.com/models/132632/epicphotogasm)

### Further Reading and Resources
- [Instruct Pix2Pix at Hugging Face](https://huggingface.co/timbrooks/instruct-pix2pix)
- [Stable Diffusion and Instruct Pix2Pix Details](https://stable-diffusion-art.com/instruct-pix2pix/)
- [Using ADetailer Settings Guide on Reddit](https://www.reddit.com/r/StableDiffusion/comments/18zi2s8/complete_guide_on_how_to_use_adetailer_after/)

There are two interesting projects that have just popped up (early May 2024):
- [https://github.com/stylus-diffusion/stylus](https://github.com/stylus-diffusion/stylus)
- [https://layered-diffusion-brushes.github.io/](https://layered-diffusion-brushes.github.io/)

Both of these look promising and may be able to more easily alter facial expressions.
Stay tuned as I'll be test driving new methods soon.
