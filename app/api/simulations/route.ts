import { handle } from '@/src/server/http/api';
export function POST(request: Request): Promise<Response> {return handle(request,'create');}
