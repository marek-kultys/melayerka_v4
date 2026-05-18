---
title: Exhibitions
permalink: /exhibitions.html
layout: default
---
<main>
  {% include nav.html %}
  <div class="main-content">
    <div class="menu-trigger hide-for-large-up"><a href="{{ site.baseurl }}/">Menu</a></div>
    <section class="showcase">
      <header>
        <h1>Exhibitions</h1>
      </header>
      <header>
        {% assign shows = site.exhibitions | sort: "name" | reverse %}
        {% for show in shows %}
          <h4><a href="{{ show.url | prepend: site.baseurl }}">{{ show.title }}</a></h4>
          <h5><a href="{{ show.url | prepend: site.baseurl }}">{{ show.venue }}</a></h5>
          <h5><a href="{{ show.url | prepend: site.baseurl }}">{{ show.dates }}</a></h5>
          {% if show.thumbnail %}
            <a href="{{ show.url | prepend: site.baseurl }}"><img src="{{ site.baseurl }}/images/{{ show.thumbnail }}"></a>
          {% endif %}
        {% endfor %}
      </header>
    </section>
    <footer class="bottom-menu show-for-large-up">
      <div class="menu-trigger hide-for-large-up"><a href="{{ site.baseurl }}/">Menu</a></div>
    </footer>
    <div class="hide-for-small">
      {% include footer.html %}
    </div>
  </div>
</main>
