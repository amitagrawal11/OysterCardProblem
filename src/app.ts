import { OysterCard } from './oyster-card';
import { OysterService } from './oyster.service';
import { TestCases } from './oyster.test-cases';

// Initiating Oyster Application
const oysterService = OysterService.Instance;
const userOysterCard = new OysterCard(8); // if you dont provide amount then it takes 30 by default

// For better understandablity, created TestCases class to test multiple scenarios
const testCases = new TestCases(oysterService, userOysterCard);

/* UseCase - As described in problem statement */
testCases.firstUseCase();

// UseCase - When user travels in only one zone outside of zone one
testCases.secondUseCase();

// UseCase - When user travels in any zone except favourable station zone (excluding Earl's court)
testCases.thirdUseCase();

// UseCase - when user jumps the first checkIn barrier and punch the card at checkout barrier
testCases.fourthUseCase();
