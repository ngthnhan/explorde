class PostsController < ApplicationController
  require 'RMagick'
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
  end

  # GET /posts/new
  def new
    @post = Post.new
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts
  # POST /posts.json
  def create
    @post = Post.new(post_params)

    respond_to do |format|
      if @post.save
				pixelate
        format.html { redirect_to root_path, notice: 'Post was successfully created.' }
        format.json { render :show, status: :created, location: @post }
      else
        format.html { render :new }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to @post, notice: 'Post was successfully updated.' }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to posts_url, notice: 'Post was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_params
      params.require(:post).permit(:title, :image)
    end

		# Todo
    def pixelate
			max_resolution = 16
			max_level = 4

			img = Magick::ImageList.new(@post.image.path(:medium))
			step = img.columns / max_resolution
			template = Magick::Image.new(step, step)
			pixel_matrices = []

			for level in 0..max_level do
				new_arr = Array.new(level**2) { Array.new(level**2) }
				pixel_matrices << new_arr
			end

			for r in 0...max_resolution do
				for c in 0...max_resolution do
					block = img.export_pixels_to_str( c * step, 
																					 r * step,
																					 step,
																					 step )
					average_pixel = template.import_pixels(0,0,step, step, "RGB", block).scale(1,1).pixel_color(0,0)

					pixel_matrices[max_level][r][c] = [average_pixel.red, average_pixel.green, average_pixel.blue]
				end
			end
			@post.pixel_matrices = pixel_matrices
			@post.save
		end		
end
