import { SinglyLinkedList } from "./LinkedList";

export class Queue<TData> {
  private _internalQueue = new SinglyLinkedList<TData>();

  enqueue(data: TData) {
    this._internalQueue.push(data);
  }

  dequeue() {
    return this._internalQueue.shift();
  }

  get size() {
    return this._internalQueue.size;
  }

  get isEmpty() {
    return this._internalQueue.isEmpty;
  }
}
