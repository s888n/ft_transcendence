# TO DO:
- [ ] before starting the backend => docker run --rm -p 6379:6379 -d redis  
- [ ] Add a Friends List
- [ ] Add match history (online ,ai ,local ,tournament)
- [ ] save pauses in the match model
- [ ] set the disconnected player as loser , if the match is not updated for 30 min = finished == True


# AI algo
```python
import numpy as np

class QLearning:
    def __init__(self, states, actions, alpha=0.5, gamma=0.9, epsilon=0.1):
        self.states = states
        self.actions = actions
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon
        self.q_table = np.zeros((states, actions))

    def choose_action(self, state):
        if np.random.uniform(0, 1) < self.epsilon:
            action = np.random.choice(self.actions)  # Explore action space
        else:
            action = np.argmax(self.q_table[state, :])  # Exploit learned values
        return action

    def update_q_table(self, state, action, reward, next_state):
        old_value = self.q_table[state, action]
        next_max = np.max(self.q_table[next_state])

        new_value = (1 - self.alpha) * old_value + self.alpha * (reward + self.gamma * next_max)
        self.q_table[state, action] = new_value
```
- In your game, you would initialize QLearning with the appropriate states and actions
- Then, in your game loop, you would use the choose_action method to decide the AI's next move
- After the AI makes a move and receives a reward, you would use the update_q_table method to update the Q-table
