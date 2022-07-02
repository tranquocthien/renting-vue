<template>
  <div class="editor">
    <v-overlay :value="isLoadingTemplate">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div style="border: 1px solid black; padding: 10px; border-radius: 10px">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="menubar">
          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <v-icon>format_bold</v-icon>
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <v-icon>format_italic</v-icon>
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
          >
            <v-icon>format_strikethrough</v-icon>
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
          >
            <v-icon>format_underline</v-icon>
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
          >
            <v-icon>code</v-icon>
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.paragraph() }"
            @click="commands.paragraph"
          >
            <v-icon>fas fa-paragraph</v-icon>
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >
            H1
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >
            H2
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
          >
            H3
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <v-icon>format_list_bulleted</v-icon>
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
          >
            <v-icon>format_list_numbered</v-icon>
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <v-icon>format_quote</v-icon>
          </v-btn>

          <v-btn
            icon
            class="menubar__v-btn"
            :class="{ 'is-active': isActive.code_block() }"
            @click="commands.code_block"
          >
            <v-icon>code</v-icon>
          </v-btn>

          <v-btn icon class="menubar__v-btn" @click="commands.horizontal_rule">
            <v-icon>horizontal_rule</v-icon>
          </v-btn>

          <v-btn icon class="menubar__v-btn" @click="commands.undo">
            <v-icon>undo</v-icon>
          </v-btn>

          <v-btn icon class="menubar__v-btn" @click="commands.redo">
            <v-icon>redo</v-icon>
          </v-btn>
        </div>
      </editor-menu-bar>
      <!-- <v-switch
        v-model="isUsingTemplate"
        :label="`Phụ lục hợp đồng mẫu`"
        class="filter"
        color="#727CF5"
      ></v-switch> -->
      <v-divider class="my-2" style="background-color: black" />
      <editor-content class="editor__content font-weight-regular" :editor="editor" />
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Placeholder,
} from 'tiptap-extensions';

export default {
  name: 'TextEditor',
  components: {
    EditorContent,
    EditorMenuBar,
  },
  props: ['editorContent', 'template'],
  computed: {
    htmlContent() {
      if (this.editor) {
        return this.editor.getHTML();
      }
      return '';
    },
  },
  methods: {
    setEditorContent() {
      return new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Phụ lục hợp đồng...',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
          }),
        ],
        content: `
          <span></span>
        `,
      });
    },
  },
  data() {
    return {
      editor: null,
      isLoadingTemplate: false,
      isUsingTemplate: false,
      initContent: null,
    };
  },
  created() {
    this.editor = this.setEditorContent();
    if (this.editorContent) {
      this.editor.setContent(this.editorContent);
      this.initContent = this.editorContent;
    } else {
      this.editor.setContent(this.template);
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  watch: {
    htmlContent: {
      handler() {
        this.$emit('appendixContent', this.htmlContent);
      },
    },
    isUsingTemplate: {
      handler(using) {
        if (using) {
          this.editor.setContent(this.template);
        } else {
          this.editor.setContent(this.editorContent);
        }
      },
    },
  },
};
</script>
<style lang="scss">
.editor p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}
</style>
