<script>
    // 開閉できるセクション
    let { title, open = $bindable(true), children } = $props();
    const id = `section-${Math.random().toString(36).slice(2, 8)}`;
</script>

<section class="block" class:closed={!open}>
    <h2>
        <button type="button" aria-expanded={open} aria-controls={id} onclick={() => (open = !open)}>
            <span>{title}</span>
            <i class="chevron" aria-hidden="true"></i>
        </button>
    </h2>
    <div class="body" {id} hidden={!open}>
        {@render children()}
    </div>
</section>

<style>
    .block {
        background: #2d3352;
        border-radius: 10px;
        overflow: hidden;
    }
    h2 { margin: 0; }
    button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 12px 20px;
        font: inherit;
        font-size: 17px;
        font-weight: bold;
        color: inherit;
        text-align: left;
        cursor: pointer;
        background: #353c5e;
        border: 0;
        border-bottom: 1px solid #3f4670;
    }
    button:hover { background: #3b4268; }
    .closed button { border-bottom-color: transparent; }
    .chevron {
        width: 9px;
        height: 9px;
        border-right: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
        transform: translateY(-2px) rotate(45deg);
        transition: transform .15s;
    }
    .closed .chevron { transform: translateX(-2px) rotate(-45deg); }
    .body { padding: 18px 20px 22px; }
    @media (prefers-reduced-motion: reduce) {
        .chevron { transition: none; }
    }
</style>
