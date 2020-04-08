# The Power of the Observer Pattern in JavaScript

In this post, we will be going over the observer pattern and implementing it with JavaScript so that, hopefully, you can attain a better understanding of it, especially if you were having trouble understanding the concept.

The observer pattern remains one of the best practices for designing decoupled systems and should be an important tool for any JavaScript developer.

The observer pattern is a design pattern in which subjects(which are simply just object with methods) maintain a list of observers who are registered to be notified of upcoming messages.

when they receive a notification event about something on the subject they are attached to, they can use these opportunities to do something useful, depending on what was received from them.

The pattern is most useful in situations when you need multiple objects to get notified simultaneously at the same time of recent changes to state. Thus, the power of this pattern comes to light when you need multiple objects to maintain consistency throughout your app, as opposed to having tightly coupled classes.

With that said, it's even possible to have several objects that aren't directly related to each other to stay consistent at the same time.

Observers can remove themselves after they are attached, so there's even some flexibility on opting in and out for one observer and the next, and vice versa.

When you have all of this functionality combined, you can build dynamic relationships between subjects and observers that make up robust functionality.

## The concept

When an observer is concerned about a subject's state and wants to opt in to observe upcoming state updates to it, they can register or attach themselves to them to receive upcoming information.

Then, when something changes, those observer will be able to get notified about it including the updates thereafter. This is done when the subject sends notification messages to its attached observers, using a broadcasting method.

Each of these notification messages can contain useful data to one or more observers that receive them. The way that notifies that messages are sent usually invokes a notify method to loop through its list of observers and inside each loop it would invoke an observer's update method.

When the observer no longer wishes to be associated with the subject, they can be detached.

Here is a short and precise table with all of the common participants that make up this pattern:

| Name | Description |
|:--- | :--- |
| Subject | Maintains observers. Can suggest the addition or removal of observers |
| Observer | Provides an update interface for objects that need to be notified of a Subject's changes of state |
| ConcreteSubject | Broadcasts notification to Observers on changes of state, stores the state of ConcreteObservers. |
| ConcreteObserver | Stores a reference to te ConcreteSubject, implements an update interface for the Observer to ensure state is consistent with the Subject's |

The first thing we are going to do is to begin creating the subject that will hold an interface for managing its observers. To do that, we are actually going to define the constructor on a separate function called ObserversList:

```js
function ObserversList() {
  this.observers = []
}

ObserversList.prototype.add = function(observer) {
  return this.observers.push(observer)
}

ObserversList.prototype.get = function(index) {
  if(typeof index !== number) {
    return
  }
  return this.observers[index]
}

ObserversList.prototype.removeAt = function(index) {
  this.observers.splice(index, 1)
}

ObserversList.prototype.count = function() {
  return this.observers.length
}

ObserversList.prototype.indexOf = function(observer, startIndex = 0) {
  let currentIndex = startIndex
  while(currentIndex < this.observers.length) {
    if (this.observers[currentIndex] === observer) {
      return currentIndex
    }
    currentIndex++
  }
  return -1
}

ObserversList.prototype.notifyAll = function(data) {
  this.observers.forEach(item => {
    item.update(data)
  })
}
```

And then we attach this interface directly on a property of a subject:

```js
function Subject() {
  this.observers = new ObserversList()
}
```

We could have defined the prototyped methods directly on the subject, but the reason we don't is because the subjects are usually going to be arbitrary instances of something in a real-world use case that just needs to inherit the observer interface, and then possibly extending its functionality or creating wrappers around them.

```js
function Observer() {
  this.update = function() {}
}
```

When different objects inherit the Observer, what usually happens is that they overwrite the update (or an updater) function that is interested in data that they were looking for.

## Real-World Example

Right before they were given their ticket number, the DMV checks if there is already a booth available before handing it to them. If there are no booths available, that's when they get placed onto the waiting list with their assigned ticket number.

When a person completes their session at the booth, let's pretend that they're done for the day. This is when their ticket number is no longer in use and can be re-used again later.

In our example, we'll be marking the ticket numbers as immediately available to assign to someone else that will get placed onto the waiting list.

define the DMV constructor:

```js
function DMV(maxTicketsToProcess = 5) {
  this.ticketsFree = new Array(40).fill(null).map((_, index) => index + 1)
  this.ticketsProcessing = [];
  this.maxTicketsToProcess = maxTicketsToProcess
  this.waitingList = new WaitingList()
}
```

Now, when we look at the DMV constructor, it's assigning this.waitingList with a WaitingList instance. That WaitingList is basically the ObserversList as it provides a nearly identical interface to manage its list of people:

```js
function WaitingList() {
  this.waitingList = []
}

WaitingList.prototype.add = function(person) {
  this.waitingList.push(person)
}

WaitingList.prototype.removeAt = function(index) {
  this.waitingList.splice(index, 1)
}

WaitingList.prototype.get = function(index) {
  return this.waitingList[index]
}

WaitingList.prototype.count = function() {
  return this.waitingList.length
}

WaitingList.prototype.indexOf = function(ticketNum, startIndex){
  let currentIndex = startIndex;
  while(currentIndex < this.waitingList.length) {
    const person = this.waitingList[currentIndex]
    if(person.ticketNum === ticketNum) {
      return currentIndex
    }
    currentIndex++
  }
  return -1
}

WaitingList.prototype.broadcastNext = function(ticketNum) {
  const self = this;
  this.waitingList.forEach(function(person) {
    person.notifyTicket(ticketNum, function accept() {
      const index = self.waitingList.indexOf(person);
      self.waitingList.removeAt(index);
      delete person.processing
      delete person.ticketNum
      self.ticketsProcessing.push(ticketNum)
    })
  })
}

function Person(name) {
  this.name = name
}

function extend(target, extensions) {
  for(let ext in extensions) {
    target[ext] = extensions[ext]
  }
}

function WaitingListPerson(ticketNum) {
  this.ticketNum = ticketNum;
  this.notifyTicket = function(num, accept) {
    if(this.ticketNum === num) {
      accept()
    }
  }
}
```

broadcastNext is the equivalent of our notifyAll method from the observersList example. Instead of calling .update, however, we call .notifyTicket which is defined on the person instance(which we will see in a bit).

We provide an accept callback function as the second argument because this will simulate the real-life scenario when a person looks at their ticket number, realizes that their assigned number is being called and walks up to their booth.