import 'es-module-lexer';
import './chunks/astro-designed-error-pages_BWI6uBTk.mjs';
import 'kleur/colors';
import './chunks/astro/server_B_OFuUZx.mjs';
import 'clsx';
import 'cookie';
import { s as sequence } from './chunks/index_as1ea_Ow.mjs';

const onRequest$1 = async (ctx, next) => {
  const { request } = ctx;
  new URL(request.url);
  return next();
};

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
