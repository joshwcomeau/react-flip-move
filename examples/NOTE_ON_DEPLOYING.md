React Hot Module Reload needs to be disabled in Production. The normal way to do this is to only enable that plugin in env.development.

I have done this: in .babelrc, the preset is only supposed to be added in development. I have also used webpack's definePlugin to set process.env.NODE_ENV to `production`.

So, I'm at a loss. The easiest (albeit very hacky) solution for now is just to remove that piece from .babelrc (the env.development bit), run `npm run build`, and then replace it.
