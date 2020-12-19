# Around extension for VS Code

**IMPORTANT**: This project has been abandoned in favor of the identical
[sammich](http://github.com/abingham/vsc-sammich). Publication of `around` to the VS Code marketplace became irreparably
broken somehow, so I decided to just restart things with an project and name.

Manage token around regions.

This is a bit of an `evil-surround` port by an Emacs refugee.

-----------------------------------------------------------------------------------------------------------

## Features

Puts before and after token around selected regions.

Just invoke the `around.around` command and select the token you want to surround your selection with. Some tokens, like parenthesis, will try to be smart by inserting the correct balancing token. Other tokens, like `"`, will just surround the region with two identical tokens.

## Configuration

`around` uses the mapping `around.pairs` to control mappings. Each key in the mapping is a string, and each value is a
pair of strings. `around` uses the mapping as follows. 

If the supplied trigger string (possibly multiple characters) is a key in the mapping, then the elements in the value
are used to surround the selection. 

Otherwise, `around` processes the trigger string character-by-character. For each character, it checks to see if it is a
key in the mapping. If so, the value is used as a two-tuple of prefix and suffix text. If not, then a two-tuple with
the character in each position is used. In both cases, the first element in the tuple is appended to the prefix text and the
second is prepended to the suffix text.

To bind a specific surrounding to a keyboard shortcut, you can add the following code snippet in your `keybindings.json`.

```json
[
  {
    "key": "ctrl+shift+9",
    "command": "extension.around",
    "args": {
      "start": "(",
      "end": ")"
    }
  }
]
```
