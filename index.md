---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: Max's AI Playground
---

<div class="text-center">Hi, fellow AI enthusiast! Welcome to my AI playground. 👋</div>

<ul class="px-6 mt-6 mb-14 list-none">
    {% for post in site.posts %}
    <li class="p-8 bg-blue-100 rounded-md">
        <h3 class="mt-0 mb-6 text-brand-red">My Latest Post from <em>{{ post.date | timeago }}</em>:</h3>
        <a class="block my-0 font-bold no-underline text-lg" href="{{ post.url }}">
            <span class="block">
                <!-- <span>»</span> -->
                <span class="underline">{{ post.title }} ({{ post.date | date: "%B %-d, %Y" }})</span>
            </span>
            <span class="block sm:w-3/4">
                <img class="!mt-4 !mb-2 shadow-sm rounded-md" src="{{ post.cover }}" srcset="{{ post.cover2x }} 2x" title="{{ post.title }}">
            </span>
        </a>
    </li>
    {% endfor %}
</ul>

### About me
I’m Max, a full-stack web developer from Germany. I’ve been a freelancer for more than 7 years and mostly use the <a href="https://tallstack.dev/" title="TALL stack" target="_blank">TALL stack</a> in my projects. I started out as a frontend engineer, using Foundation and Bootstrap. I always enjoyed working with the latest JS frameworks and began my journey using good old jQuery. I have experience using React, Angular, Vue.js and plenty of other JS frameworks.

Currently, I enjoy working with Laravel and Tailwind CSS. I also frequently use Livewire and Alpine.js.

### My goal
I am transitioning from freelance work to becoming a full-time content creator. I’m passionate about exploring cutting-edge AI technology and love the hands-on approach. Here, you’ll find more practical code examples than theoretical discussions. If you're intrigued by the practical application of AI and enjoy seeing code in action, feel free to follow me on my journey.