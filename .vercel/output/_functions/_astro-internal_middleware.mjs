import 'es-module-lexer';
import './chunks/astro-designed-error-pages_BsTQnzAt.mjs';
import 'kleur/colors';
import './chunks/astro/server_QTRnay6T.mjs';
import 'clsx';
import 'cookie';
import { s as sequence } from './chunks/index_p2z4b08T.mjs';

const onRequest$1 = async (ctx, next) => {
  const { request } = ctx;
  new URL(request.url);
  return next();
};

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
