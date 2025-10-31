# melayerka_v4

Artist portfolio website for Mela Yerka, migrated to Jekyll with Bourbon and Neat.

All rights reserved to all paintings, images and photos published on this site.

## Setup

This site uses Jekyll with Bourbon and Neat for styling.

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Run Jekyll locally:
   ```bash
   bundle exec jekyll serve
   ```

3. The site will be available at `http://localhost:4000`

## Structure

- `_layouts/` - Jekyll layouts (default, painting, text, showcase, by-series)
- `_includes/` - Reusable components (head, menu, analytics)
- `_sass/` - Sass partials using Bourbon and Neat
- `_data/` - Data files (series.yml)
- `assets/` - CSS and JavaScript assets
- Root level markdown files are converted pages

## Notes

- CSS has been migrated from Foundation to use Bourbon mixins and Neat grid system
- All HTML pages have been converted to Jekyll markdown with front matter
- Painting pages should be converted individually or managed through a Jekyll collection
- Original HTML files can be removed after verifying the migration works correctly
