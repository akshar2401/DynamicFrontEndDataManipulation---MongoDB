import { Errors } from "../Errors";
import { Utilities } from "../Utilities";

class ListNode<TData> {
  data: TData;
  next: ListNode<TData>;
  constructor(data: TData) {
    this.data = data;
  }
}

export class SinglyLinkedList<TData> {
  private head: ListNode<TData>;
  private tail: ListNode<TData>;
  private _length = 0;

  push(data: TData) {
    if (Utilities.isNullOrUndefined(this.head)) {
      this.head = new ListNode(data);
      this.tail = this.head;
    } else {
      const newNode = new ListNode(data);
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this._length++;
  }
  shift() {
    Errors.throwIfObjEmptyOrNullOrUndefined(
      { length: this._length },
      "Singly Linked List"
    );
    const element = this.head.data;
    this.head = this.head.next;
    this._length--;
    return element;
  }
  get peek() {
    Errors.throwIfObjEmptyOrNullOrUndefined(
      { length: this._length },
      "Singly Linked List"
    );
    return this.head.data;
  }

  get isEmpty() {
    return this._length === 0;
  }

  get size() {
    return this._length;
  }
}
