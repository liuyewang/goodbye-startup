import { handle } from '@/src/server/http/api';
export async function POST(request: Request,context:{params:Promise<{id:string}>}): Promise<Response> {return handle(request,'turn',(await context.params).id);}
