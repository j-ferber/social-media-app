import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from './ui/sheet';
import {Button} from './ui/button';
import {MessageCircle} from 'lucide-react';
import CommentForm from './CommentForm';

const CommentSheet = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <MessageCircle className="ml-4 text-white hover:scale-110 hover:cursor-pointer active:scale-105" />
      </SheetTrigger>
      <SheetContent className="w-full">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>
            Any comments here can be seen by everyone
          </SheetDescription>
        </SheetHeader>
        <CommentForm />
        <SheetFooter>
          <SheetClose asChild>
            <Button variant={'secondary'}>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CommentSheet;
